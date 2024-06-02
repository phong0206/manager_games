import mongoose from "mongoose";
import config from './config'

let countRetry = 0;

export default async function connectDatabase() {
  mongoose.Promise = global.Promise;
  try {
    await mongoose.connect(config.mongoose.url);
    console.log("Connected to MongoDB successfully");
    countRetry = 0;
  } catch (err) {
    console.error("Connection error", err);
    countRetry += 1;
    console.log(`Could not connect to the mongo database. Retry times: ${countRetry}`);
    if (countRetry < 4) {
      setTimeout(connectDatabase, 3000);
    } else {
      process.exit();
    }
  }
};
