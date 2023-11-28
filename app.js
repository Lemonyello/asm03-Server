const path = require("path");

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const multer = require("multer");

const MONGODB_URI = process.env.DB_URL;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
  expires: 360000,
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toLocaleString().split("/").join("-").split(":").join("") +
        "-" +
        file.originalname
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  )
    cb(null, true);
  else cb(null, false);
};

const userRoutes = require("./routes/user");
const productAdminRoutes = require("./routes/admin/product");
const productUserRoutes = require("./routes/user/product");
const orderUserRoutes = require("./routes/user/order");
const orderAdminRoutes = require("./routes/admin/order");

app.use(cors());
app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).array("images")
);

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use("/users", userRoutes);
app.use("/products/user", productUserRoutes);
app.use("/orders/user", orderUserRoutes);
app.use((req, res, next) => {
  if (req.query.role === "admin") next();
  else throw new Error();
});
app.use("/products/admin", productAdminRoutes);
app.use("/orders/admin", orderAdminRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).json({
    msg:
      "Something went wrong" +
      (error.httpStatusCode === 1
        ? " or you didn't fill out all fields (try adding 4 images, not just 1)."
        : "."),
  });
  // res.status(500).json({ msg: error });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    const server = app.listen(process.env.PORT || 5000);
    const io = require("./socket").init(server);

    io.on("connection", (socket) => {
      socket.on("user_join_room", (data) => {
        const { username, room, msg } = data;
        socket.join(room);
        io.emit("new_user_chat", { username, room, msg });
      });

      socket.on("admin_join_room", (data) => {
        socket.join(data.room);
      });

      socket.on("send_message", (data) => {
        const { message, username, room } = data;

        io.in(room).emit("receive_message", data); // to() = send to all apart from this user, in() = send to all including this user
      });

      socket.on("leave_chat", (data) => {
        io.emit("user_leave_chat", data);
      });
    });
  })
  .catch((err) => {
    console.log(err);
  });
