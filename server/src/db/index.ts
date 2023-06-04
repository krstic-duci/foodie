import mongoose from "mongoose";

import log from "../utils/log";

interface Database {
  connect: () => Promise<void>;
}

export const db: Database = {
  connect: async () => {
    const URL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.phsqvvi.mongodb.net/?retryWrites=true&w=majority`;
    mongoose.connection.once("connected", () => {
      log.warning("[MongoDB] Connected to MongoDB!");
    });
    mongoose.connection.on("error", (err) => {
      console.error(err);
    });
    await mongoose.connect(URL, { dbName: "foodie" });
  }
};
