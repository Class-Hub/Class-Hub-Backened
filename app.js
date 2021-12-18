const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const morgan = require("morgan");
const connectDB = require("./config/db");
const ejs = require("ejs");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
let server = require("http").Server(app);

// let stream = require("./src/ws/stream");
// const { authPass } = require("./controller/authController");
// const getName = require("./controller/authController");

dotenv.config({ path: "./config/config.env" });
connectDB();

app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.set("views", path.join(__dirname, "./src/views"));
app.set("view engine", "ejs");


app.use("/videos", express.static(path.join(__dirname + "/Lectures")));
app.use("/thumbnail", express.static(path.join(__dirname + "/thumbnail")));
app.use("/", require("./routes/auth"));
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
app.use("/", require("./routes/video"));

app.use("/assets", express.static(path.join(__dirname, "/src/assets")));

// app.get("/liveClass", (req, res) => {
//   const name = process.env.getName;
//   console.log(name);
//   res.render("index", { name });
// });

// io.of("/stream").on("connection", stream);

require("./socket")(server);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`);
});

// require('./socket')(Server)