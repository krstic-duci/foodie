import * as dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

interface Database {
  connect: () => Promise<void>;
}

export const db: Database = {
  connect: async () => {
    const { DB_USERNAME, DB_PASSWORD } = process.env;
    const URL = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.phsqvvi.mongodb.net/?retryWrites=true&w=majority`;
    mongoose.connection.once("connected", () => {
      console.log("Connected to MongoDB!");
    });
    mongoose.connection.on("error", (err) => {
      console.error(err);
    });
    await mongoose.connect(URL, { dbName: "foodie" });
  }
};
