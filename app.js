const express = require("express");
const index = require("./routes/index");

const app = express();

const pool = require("./config/postgreConfig");

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", index);

app.listen(3000);
