const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");

const app = express();

const port = 3005; // because I'm bad like that..

let db = require("./config/db");

const client = new MongoClient(db.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json({ limit: "50mb" }));

client.connect(function(err) {
  if (err) return console.log(err);

  db = client.db("unilag-nuga-veterans");

  require("./app/routes")(app, db);
  app.listen(port, () => console.log("Hello there"));
});
