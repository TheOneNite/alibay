//setup of express library
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//setup of multer lib
const multer = require("multer");
const upload = multer();

//setup and initialzie mongo db
const mongoClient = require("mongodb").MongoClient;
const dbCredientials = require("./custom_modules/mongo/dbURI.js");

let mongoDb = undefined;
mongoClient.connect(dbCredientials, (err, dbRef) => {
  if (err) {
    console.log(err);
  }
  mongoDb = dbRef;
  console.log("-----------database initialized-----------");
});

//boilerplate
let reloadMagic = require("./reload-magic.js");
reloadMagic(app);

app.use("/", express.static("build")); // Needed for the HTML and JS files
app.use("/", express.static("public")); // Needed for local assets

// Your endpoints go after this line

app.get("/items");

// Your endpoints go before this line

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
