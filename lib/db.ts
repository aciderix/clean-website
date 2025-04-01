import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 30000,
    }

    console.log("Connecting to MongoDB...")
    
    cached.promise = mongoose.connect(MONGODB_URI!, opts)
      .then((mongoose) => {
        console.log("MongoDB connected successfully")
        return mongoose
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error)
        throw error
      })
  }
  
  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (error) {
    console.error("Failed to establish MongoDB connection:", error)
    throw error
  }
}

export default connectDB

