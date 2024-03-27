const mongoose = require("mongoose");
const colors = require("colors");

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);

    console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red.bold);
  }
};

module.exports = connectDb;
