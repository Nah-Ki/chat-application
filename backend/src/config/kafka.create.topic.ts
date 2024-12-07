import { kafka } from "./kafka.config.js";

export async function createTopicIfNotExists(topicName: string) {
  const admin = kafka.admin();
  await admin.connect();
  console.log("Admin connected for topic creation...");

  const topics = await admin.listTopics();
  if (!topics.includes(topicName)) {
    console.log(`Creating topic: ${topicName}`);
    await admin.createTopics({
      topics: [
        {
          topic: topicName,
          numPartitions: 1, 
        },
      ],
    });
    console.log(`Topic "${topicName}" created successfully.`);
  } else {
    console.log(`Topic "${topicName}" already exists.`);
  }

  await admin.disconnect();
}

