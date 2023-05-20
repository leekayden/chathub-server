// server.js

const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

module.exports = (req, res) => {
  if (req.url === "/api/auth") {
    // Handle auth routes
    return authRoutes(req, res);
  } else if (req.url === "/api/messages") {
    // Handle message routes
    return messageRoutes(req, res);
  } else {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Server");
  }
};
