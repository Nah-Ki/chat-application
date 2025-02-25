scalable-chat-app
Kafka and WebSocket Integration for Scalable Chat Application
This document explains how Kafka can be integrated with WebSockets to build a scalable and efficient messaging system for a chat application. The focus is on the step-by-step process with relevant code snippets for better understanding.

Overview
Kafka is used for handling message delivery and persistence, ensuring reliable and scalable communication.
WebSocket enables real-time communication between clients, creating an interactive chat experience.
Steps for Integration
1. Setting Up Kafka
Install and Configure Kafka: Ensure Kafka is installed and running locally or on a server. Configure brokers and zookeepers as needed.
Admin Connection: Use Kafka's admin client to connect to the broker and manage topics.
Creating Topics
Before producing or consuming messages, ensure the required topic exists.
Example Code:

import { kafka } from "./kafka.config.js";

export async function createTopicIfNotExists(topicName: string) {
  const admin = kafka.admin();
  await admin.connect();
  console.log("Admin connected for topic creation...");

  const topics = await admin.listTopics();
  if (!topics.includes(topicName)) {
    console.log(`Creating topic: ${topicName}`);
    await admin.createTopics({
      topics: [{ topic: topicName, numPartitions: 1 }],
    });
    console.log(`Topic "${topicName}" created successfully.`);
  } else {
    console.log(`Topic "${topicName}" already exists.`);
  }
  await admin.disconnect();
}
2. Kafka Producer and Consumer
Producer: Responsible for sending messages to Kafka topics.
Logic: Create a producer instance, connect it, and send messages to the desired topic.
Consumer: Reads messages from Kafka topics.
Logic: Create a consumer instance, subscribe to the topic, and process incoming messages.
Example Code:

import { Kafka, logLevel } from "kafkajs";

const kafka = new Kafka({ brokers: ["localhost:9092"], logLevel: logLevel.ERROR });
export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "chats" });

export const connectKafkaProducer = async () => {
  await producer.connect();
  console.log("Kafka Producer connected...");
};
3. Starting Kafka Services During Server Initialization
When starting the server, ensure:
Kafka topics are created (if not already existing).
The producer is connected and ready to send messages.
The consumer is subscribed and ready to handle incoming messages.
Example Code:

(async () => {
  try {
    await createTopicIfNotExists("chats");
  } catch (error) {
    console.error("Error while creating topic:", error);
  }
})();

connectKafkaProducer().catch((err) => {
  console.log("Something went wrong in connecting with Kafka", err);
});
4. WebSocket Server Setup
Initialize WebSocket Server: Set up WebSocket to allow clients to connect and communicate.
Room Management: Authenticate users and assign them to specific chat rooms.
Message Handling:
On receiving a message from a client, produce it to the Kafka topic.
Broadcast the message to other clients in the same room.
Example Code:

import { Server } from "socket.io";
import { produceMessage } from "./kafka-producer";

export function setupSocket(io: Server) {
  io.use((socket, next) => {
    const room = socket.handshake.auth.room || socket.handshake.headers.room;
    if (!room) {
      return next(new Error("Invalid room id"));
    }
    socket.room = room;
    next();
  });

  io.on("connection", (socket) => {
    socket.join(socket.room);
    console.log("Socket connected...", socket.id);

    socket.on("message", async (data) => {
      console.log("Received message", data);
      await produceMessage("chats", data);
      socket.to(socket.room).emit("message", data);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected...", socket.id);
    });
  });
}
5. Producing Messages to Kafka
Messages sent by WebSocket clients are passed to Kafka using the producer.
Logic: Serialize the message and produce it to the specified Kafka topic.
Example Code:

export const produceMessage = async (topic: string, message: any) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    console.log("Message sent to Kafka:", message);
  } catch (error) {
    console.error("Error sending message to Kafka:", error);
  }
};
6. Broadcasting Messages with WebSocket
The WebSocket server listens to messages from Kafka (via a consumer).
Broadcast these messages to other connected clients in the appropriate room.
Setting Up the WebSocket Server

You’re using Socket.IO on the server to handle real-time communication. The server: Validates Clients: Each client must pass a room ID when connecting. Assigns Clients to Rooms: Once validated, clients join their specific chat room. Listens for Messages: When a client sends a message, the server processes it and emits the message to all other clients in the same room.

Code Breakdown:

Middleware:
    Validates the room from the handshake (auth or headers).
    If room is missing, the connection is rejected.
Connection Handling:
    On a new connection, the client is added to the specified room using socket.join(socket.room).
    Messages are sent to other clients in the same room using socket.to(socket.room).emit("message", data).
Message Broadcasting:
    When a client sends a message, it’s logged and sent to Kafka using produceMessage.
    The message is also broadcast to all other clients in the same room.
Initializing the WebSocket Server
In the index.ts file:

The server is created using Node.js' http.createServer.
Socket.IO is attached to the server and configured with:
    CORS (Cross-Origin Resource Sharing): Allows your client apps (frontend) to communicate with the WebSocket server.
    Redis Adapter: Used to manage messages across multiple servers when scaling horizontally (multiple Node.js servers).
The setupSocket function is called to configure the WebSocket handling logic.
Client-Side WebSocket Setup
In socket.config.ts:

A singleton pattern is used to ensure there is only one active connection between the client and the server.
When you call getSocket(), it initializes a new Socket.IO connection if one doesn’t exist.
The client connects to the WebSocket server using Env.BACKEND_URL.
Message Flow
Now let’s understand the lifecycle of a message in your system:

Client Sends a Message

A client sends a message via the WebSocket connection using socket.emit("message", data).

Server Processes the Message

On the server, the message event is triggered: The server logs the message. The message is sent to Kafka using produceMessage("chats", data). Kafka ensures the message is durable and scalable. The server broadcasts the message to other clients in the same room using socket.to(socket.room).emit("message", data).

Other Clients Receive the Message

Clients in the same room listen for the message event. When triggered, they receive and display the message in their UI.

Kafka Integration (Coming Later)

For now, you’re producing the messages to Kafka (produceMessage). Eventually, you’ll likely consume these messages from Kafka to persist them, process them, or even broadcast them to other services.

Key Concepts to Remember

Room-Based Communication:
    Clients join specific rooms. Messages are scoped to these rooms, preventing unnecessary broadcasts.
Kafka for Scalability:
    Kafka ensures messages are durable and can be processed asynchronously.
WebSocket for Real-Time Updates:
    Socket.IO ensures clients receive messages instantly as they are broadcast.
Example Workflow

Let’s say Client A and Client B join the same room (room123):

Client A sends a message: "Hello, Room 123!".
The server:
    Produces the message to Kafka (chats topic).
    Broadcasts the message to all other clients in room123.
Client B receives the message and displays it in their chat window.
Summary

Server: Manages WebSocket connections, validates rooms, and handles message broadcasting.
Client: Connects to the WebSocket server and listens for messages.
Kafka: Acts as a backbone for durable, scalable message handling.
Advantages of This Integration
Scalability: Kafka handles large-scale message processing efficiently.
Reliability: Messages are persisted in Kafka, reducing the chance of data loss.
Real-Time Communication: WebSocket ensures instant delivery to connected clients.
Summary
By combining Kafka and WebSocket, the system achieves reliable, real-time, and scalable communication. Kafka ensures message durability and processing, while WebSocket manages live interactions. This integration is ideal for chat applications requiring high availability and responsiveness.
