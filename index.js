const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
const morgan = require("morgan");
require("dotenv").config();

const port = process.env.PORT || 5000;
const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/chat"

app.use(cors());
app.use(express.json());

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.get("/", (req, res) => {
  res.send("chathub server");
});

app.use(morgan("combined"));
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

const io = socket(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
