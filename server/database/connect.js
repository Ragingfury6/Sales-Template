const mongoose = require('mongoose');
require('dotenv').config();
const connect = async () => {
  mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true });
  const db = mongoose.connection;
  db.on('error', () => {
    console.log("Couldn't Connect");
  });
  db.once('open', () => {
    console.log('Successfully Connected To Database');
  });
};
module.exports = { connect };
