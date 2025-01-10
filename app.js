require("dotenv").config({ path: "./.env" });
require("./api/config/db");

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.SERVER_PORT;
const routes = require("./api/routes");
const cors = require("cors");
const cron = require("node-cron");
const { dailyScheduleSmsEmail } = require("./api/services/commonService");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://127.0.0.1:4200",
    "http://localhost:4200",
    "treo.cloud",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,X-Access-Token,X-Key,If-Modified-Since,Authorization"
  );
  res.header("Access-Control-Allow-Credentials", true);
  return next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

path = require("path");
app.use("/api/v1", express.static(path.join(__dirname, "public")));

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

cron.schedule("0 0 0 * * *", async function () {
  dailyScheduleSmsEmail();
});

app.listen(port, () => {
  console.log(`App listening at Port: ${port}`);
});

module.exports = app;
