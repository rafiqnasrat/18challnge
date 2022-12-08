const mongoose = require("mongoose");

// CONNECTION
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/challeng18",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);


mongoose.set("debug", true);

module.exports = mongoose.connection;
