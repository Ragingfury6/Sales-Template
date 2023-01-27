const mongoose = require('mongoose');
// Basic schema for MongoDB
const UserSchema = new mongoose.Schema({
  google: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
  },
});
const User = mongoose.model('User', UserSchema);
module.exports = User;
