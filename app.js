const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

const index = require("./routes/index");
const pool = require("./config/postgreConfig");
const createGadgetTable = require("./models/gadget");
const createUserTable = require("./models/user");
createGadgetTable();
createUserTable();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", index);

app.listen(3000);
