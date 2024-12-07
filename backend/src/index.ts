import { createAdapter } from "@socket.io/redis-streams-adapter";
import cors from "cors";
import "dotenv/config";
import express, { Application, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { redis } from "./config/redis.config.js";
import Routes from "./routes/index.js";
import { setupSocket } from "./socket.js";
import { instrument } from "@socket.io/admin-ui";
import { createTopicIfNotExists } from "./config/kafka.create.topic.js";
import { connectKafkaProducer } from "./config/kafka.config.js";
import { consumeMessage } from "./helper.js";

const app: Application = express();
const PORT = process.env.PORT || 7000;

(async () => {
  try {
    await createTopicIfNotExists("chats");
  } catch (error) {
    console.error("Error while creating topic:", error);
  }
})();

// Socket io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://admin.socket.io"],
    credentials: true
  },
  adapter: createAdapter(redis),
});

instrument(io, {
  auth: false,
  mode: "development"
});

setupSocket(io);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => {
  return res.send("It's working 🙌");
});

// Routes
app.use("/api", Routes);

// kafka things
connectKafkaProducer().catch((err) => {
  console.log("Something went wrong in connecting with kafka", err);
})

consumeMessage("chats").catch((err) => {
  console.log("Consumer error: ", err)
})

server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

