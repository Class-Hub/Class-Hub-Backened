const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const morgan = require("morgan");
const connectDB = require("./config/db");
const auth = require("./routes/auth");
const app = express();
var cors = require('cors')
let server = require("http").Server(app);
let io = require("socket.io")(server);
let stream = require("./src/ws/stream");
const video = require("./routes/video");
const { authPass } = require("./controller/authController");

dotenv.config({ path: "./config/config.env" });
connectDB();

app.use(express.urlencoded({ extended: false }));
app.use(cors())
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/videos", express.static(path.join(__dirname + "/Lectures")));
app.use("/thumbnail", express.static(path.join(__dirname + "/thumbnail")));
app.use("/", auth);
app.use("/teacher", require("./routes/teacher"));
app.use("/subject", require("./routes/subject"));
app.use("/student", require("./routes/student"));

/* --------------------------- GoogleClass Routes --------------------------- */

const classRouter = require("./routes/Class/class.router");
const classworkRouter = require("./routes/Class/classwork.router");

app.use("/class", classRouter);
app.use("/classwork", classworkRouter);

/* ------------------------------- Chat Routes ------------------------------ */
app.use("/conversation", require("./routes/conversation"));
app.use("/message", require("./routes/messages"));
app.use("/", video);

app.use("/assets", express.static(path.join(__dirname, "/src/assets")));

app.get("/video", (req, res) => {
  res.sendFile(__dirname + "/src/index.html");
});

io.of("/stream").on("connection", stream);

const PORT = process.env.PORT || 8000;

// app.listen(
//   PORT,
//   console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`)
// );

var Server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`);
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

var IO = require("socket.io")(Server);

IO.on("connection", (socket) => {
  console.log("User is connected", socket.id);
  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    IO.emit("getUsers", users);
    console.log(users);
  });

  //send and get message
  socket.on("sendMessage", (receiverId, senderId, text, test) => {
    console.log(senderId);
    console.log(test);
    console.log(receiverId);
    console.log(users);
    const user = getUser(receiverId);
    console.log(user);
    IO.to(user.socketId).emit("getMessage", {
      sender: senderId,
      text,
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    IO.emit("getUsers", users);
  });
});
