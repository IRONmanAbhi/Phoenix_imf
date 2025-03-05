const express = require("express");
const index = require("./routes/index");
const cookieParser = require("cookie-parser");

const app = express();

const pool = require("./config/postgreConfig");
const createGadgetTable = require("./models/gadget");
const createUserTable = require("./models/user");
createGadgetTable();
createUserTable();

require("dotenv").config();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", index);

app.listen(3000);
