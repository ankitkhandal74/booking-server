const mongoose = require('mongoose');

// Set up the MongoDB URI from environment or default
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://myhelth:myhelth@cluster0.5b4f2dy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://Yugi:Yugi@cluster0.l63lbgd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

if (!global.mongoose) {
  global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // If there's an existing connection, use it
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  // Otherwise, create a new connection promise
  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000
    }).then((mongoose) => mongoose);
  }

  // Await the promise to establish the connection
  global.mongoose.conn = await global.mongoose.promise;
  return global.mongoose.conn;
}

module.exports = dbConnect;
