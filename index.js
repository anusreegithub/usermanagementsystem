const express = require("express");
const path = require("path");
const app = express();

require('dotenv').config();
const port = process.env.PORT;
const authRoute = require("./routes/auth");
const connectDB = require("./db/connectdb");
const session = require("express-session");
//store session data in db
const mongoDBSession = require("connect-mongodb-session")(session);
const nocache = require("nocache");
const hbs = require("hbs");
app.use(express.static("public"));
//to enbale features of express application
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(__dirname + "/public"));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

const store = new mongoDBSession({
  uri: process.env.MONGO_URI, 
  collection: "sessions",
});
console.log("Mongo URI:", process.env.MONGO_URI);


app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);


app.use(nocache());

app.use("/admin/home", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});
app.use("/user/home", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});
app.use("/", authRoute);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
