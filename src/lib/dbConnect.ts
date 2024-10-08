import mongoose, { ConnectOptions } from "mongoose";

type ConnectionObject = {
  isConnected?: boolean | undefined;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("db is already connected");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    connection.isConnected = db.connection.readyState === 1;
    console.log("DB Connected successfully");
  } catch (error) {
    console.log("Error connecting to database", error);
    process.exit(1);
  }
}

export default dbConnect;
