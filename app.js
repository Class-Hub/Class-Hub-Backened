const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const morgan = require("morgan");
const connectDB = require("./config/db");
const auth = require("./routes/auth");
const app = express();
let server = require("http").Server(app);
let io = require("socket.io")(server);
let stream = require("./src/ws/stream");
const video = require("./routes/video");
const { authPass } = require("./controller/authController");

dotenv.config({ path: "./config/config.env" });
connectDB();

app.use(express.urlencoded({ extended: false }));
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
app.use("/", video);

app.use("/assets", express.static(path.join(__dirname, "/src/assets")));

app.get("/video", (req, res) => {
  res.sendFile(__dirname + "/src/index.html");
});

io.of("/stream").on("connection", stream);

const PORT = process.env.PORT || 8000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`)
);
