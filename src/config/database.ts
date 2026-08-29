import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const MAX_RETRIES = 5;
const RETRY_DELAY = 3000;

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined");
  }

  const isProduction = process.env.NODE_ENV === "production";

  for (let attempt = 1; attempt <= (isProduction ? MAX_RETRIES : 1); attempt++) {
    try {
      await mongoose.connect(mongoUri, {
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 5000,
      });

      console.log("MongoDB connected");
      return;
    } catch (error) {
      console.error(
        `MongoDB connection attempt ${attempt} failed:`,
        error
      );

      if (!isProduction || attempt === MAX_RETRIES) {
        throw error;
      }

      console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);

      await new Promise((resolve) =>
        setTimeout(resolve, RETRY_DELAY)
      );
    }
  }
};