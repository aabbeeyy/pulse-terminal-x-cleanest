import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;
declare global { var mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined; }
const cached = global.mongooseCache || (global.mongooseCache = { conn: null, promise: null });
export async function connectToDatabase() { if (!MONGODB_URI) throw new Error("Missing MONGODB_URI. Add a MongoDB connection string to your environment."); if (cached.conn) return cached.conn; if (!cached.promise) cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false, dbName: process.env.MONGODB_DB || "pulse_terminal_x" }); cached.conn = await cached.promise; return cached.conn; }
