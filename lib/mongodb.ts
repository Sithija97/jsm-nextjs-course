import mongoose, { Connection } from "mongoose";

// Ensure the MONGODB_URI environment variable is defined
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

/**
 * Global cache for the Mongoose connection.
 *
 * In development, Next.js clears the Node.js module cache on every request,
 * which would create a new database connection each time. By caching the
 * connection on the `globalThis` object, we reuse the existing connection
 * across hot reloads and avoid exhausting the database connection pool.
 */
const cached = globalThis.mongoose ?? { conn: null, promise: null };

if (!globalThis.mongoose) {
  globalThis.mongoose = cached;
}

/**
 * Connects to MongoDB and returns the cached connection.
 *
 * - Returns the existing connection if one is already established.
 * - Otherwise, creates a new connection promise, awaits it, caches it,
 *   and returns the active connection.
 */
const dbConnect = async (): Promise<Connection> => {
  // If a connection already exists, return it immediately
  if (cached.conn) return cached.conn;

  // If no connection promise exists yet, create one
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "linkedin-clone",
        bufferCommands: false, // Disable command buffering for faster error feedback
      })
      .then((mongooseInstance) => mongooseInstance.connection);
  }

  // Await the connection promise and cache the resolved connection
  cached.conn = await cached.promise;

  return cached.conn;
};

export default dbConnect;
