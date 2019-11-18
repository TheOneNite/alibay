//libraries setup
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const multer = require("multer");
const upload = multer();

const auth = require("password-hash");

//setup and initialzie mongo db
const mongoClient = require("mongodb").MongoClient;
const dbCredientials = require("./mongo/dbURI.js");

let mongoDb = undefined;
// let aliDb = undefined;
// mongoClient.connect(dbCredientials, (err, dbRef) => {
//   if (err) {
//     console.log(err);
//   }
//   mongoDb = dbRef;
//   aliDb = mongoDb.db("alibay");
//   console.log("-----------database initialized-----------");
// });

//boilerplate
let reloadMagic = require("./reload-magic.js");
reloadMagic(app);
const tools = require("./custom_modules/tools.js");

app.use("/", express.static("build")); // Needed for the HTML and JS files
app.use("/", express.static("public")); // Needed for local assets

//global vars grr
let sessions = {};

// Your endpoints go after this line

app.get("/items", (req, res) => {
  aliDb
    .collections("items")
    .find({})
    .toArray((err, data) => {
      if (err) {
        console.log(err);
      }
      console.log("data retreived (array) eg:");
      console.log(console.log(data[0]));
      let pkg = data;
      res.send(pkg);
    });
});

app.post("/login", upload.none(), (req, res) => {
  // testing endpoint
  if (req.body.username === "user") {
    pkg = { success: true };
    res.send(JSON.stringify(pkg));
    return;
  }
  pkg = { success: false };
  res.send(JSON.stringify(pkg));
  // start real endpoint
  const sid = req.cookies.sid;
  if (sessions[sid] != undefined) {
    let pkg = { success: true };
    res.send(JSON.stringify(pkg));
    return;
  } else {
    const userGiven = req.body.username;
    aliDb.auth.findOne(
      { username: userGiven },
      (err,
      dbResult => {
        if (err) {
          console.log(err);
        }
        console.log("user auth retrevied");
        let chal = dbResult.password;
        if (auth.verify(req.body.password, chal)) {
          let pkg = { success: true };
          sessions[tools.generateId(6)] = req.body.userGiven;
          res.send(JSON.stringify(pkg));
          return;
        } else {
          let pkg = { success: false, msg: "invalid username or password" };
          res.send(JSON.stringify(pkg));
          return;
        }
      })
    );
  }
});

app.post("/signup", upload.none(), async (req, res) => {
  //mocked endpont
  if (req.body.username === "user") {
    pkg = { success: true };
    res.send(JSON.stringify(pkg));
    return;
  }
  if (req.body.username === "guest") {
    pkg = { success: false };
    res.send(JSON.stringify(pkg));
    return;
  }
  //begins real endpoint
  let userGiven = req.body.username;
  aliDb.auth.find({ username: userGiven }).toArray((err, dbResult) => {
    if (err) {
      console.log(err);
    }
    if (dbResult.length > 0) {
      console.log("username exists");
      pkg = {
        success: false,
        msg: "that username is taken, please try another"
      };
      res.send(JSON.stringify(pkg));
      return;
    } else {
      let hpass = auth.generate(req.body.pass);
      alidDb
        .collections("auth")
        .insertOne(
          { username: userGiven, password: hpass },
          (err, dbResult) => {
            if (err) {
              console.log(err);
            }
            console.log("user auth info stored");
            return true;
          }
        );
      let userdata = {
        userId: tools.generateId(6),
        username: userGiven,
        displayName: userGiven,
        location: "",
        paymentMethods: [],
        orders: [],
        sales: [],
        cart: []
      };
      aliDb.collections("users").insertOne(
        { userdata },
        (err,
        dbResult => {
          if (err) {
            console.log(err);
          }
          console.log("user data pushed to db");
        })
      );
    }
  });
});

app.post("/settings", upload.none(), (req, res) => {});

// Your endpoints go before this line

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
