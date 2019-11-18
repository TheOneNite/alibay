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
const retreive = require("./mongo/retreive.js");

let mongoDb = undefined;
let aliDb = undefined;
mongoClient.connect(dbCredientials, (err, dbRef) => {
  if (err) {
    console.log(err);
  }
  mongoDb = dbRef;
  aliDb = mongoDb.db("alibay");
  console.log("-----------database initialized-----------");
});

//boilerplate
let reloadMagic = require("./reload-magic.js");
reloadMagic(app);
const tools = require("./custom_modules/tools.js");

app.use("/", express.static("build")); // Needed for the HTML and JS files
app.use("/", express.static("public")); // Needed for local assets

//global vars grr
let sessions = {};

//modules and stuff

//updating user data
const updateUser = (userData, req) => {
  const newData = req.body;
  const updatedUser = { ...userData, ...newData };
  return updatedUser;
};

// Your endpoints go after this line

app.get("/items", upload.none(), (req, res) => {
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

//user authentication endpoints------------------------------------------------------------------------------------------
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
          sessions[tools.generateId(6)] = dbResult.id;
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
      let uid = tools.generateId(6);
      alidDb
        .collections("auth")
        .insertOne(
          { username: userGiven, password: hpass, id: uid },
          (err, dbResult) => {
            if (err) {
              console.log(err);
            }
            console.log("user auth info stored");
            return true;
          }
        );
      let userdata = {
        userId: uid,
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

app.get("/logout", (req, res) => {
  sessions[req.cookies.sid] = undefined;
  res.send(JSON.stringify({ success: true }));
});

//commerce endpoints------------------------------------------------------------------------------------------
app.post("/additem", upload.none(), (req, res) => {
  //add new sale item from form data
  let sellerId = sessions[req.cookies.sid];
  let sellerData = {};
  retreive("users", { userId: sellerId }, aliDb).then(dbResult => {
    if (dbResult.success === false) {
      console.log("retreiving seller data failed");
      res.send(
        JSON.stringify({
          success: false,
          msg: "seller data could not be found"
        })
      );
      return;
    }
    sellerData = dbResult.data;
  });
  let newItem = {
    itemId: tools.generateId(10),
    price: parseInt(req.body.price),
    title: req.body.title,
    description: req.body.description,
    sellerId: sellerData.userId,
    shipsFrom: req.body.location,
    smallImage: req.body.image,
    largeImage: req.body.largeImage
  };
  aliDb.collections("items").insertOne(newItem, (err, result) => {
    if (err) {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
      return;
    }
    console.log("new item pushed to db");
    res.send(JSON.stringify({ success: true }));
    return;
  });
});

app.post("/cart", upload.none(), (req, res) => {});

app.post("/checkout", upload.none(), (req, res) => {
  const uid = sessions[req.cookies.sid];
});

//account management endpoints---------------------------------------------------------------------------------------
app.post("/account", upload.none(), (req, res) => {
  //updates user info from form submission
  let userData = {};
  const uid = sessions[req.cookies.sid];
  retreive("users", { userId: uid }, aliDb).then(dbResult => {
    const mongoUid = dbResult.data._id;
    if (dbResult) {
      console.log("user data retreived");
      userData = dbResult.data;
      userData = updateUser(userData, req);
      console.log("user data updated");
      aliDb
        .collections("users")
        .save({ _id: mongoUid }, userData, (err, result) => {
          if (err) {
            console.log(err);
          }
          res.send(JSON.stringify({ success: true, data: result }));
          return;
        });
      return;
    } else {
      console.log(err);
      res.send(
        JSON.stringify({
          success: false,
          msg: "user data could not be retreived"
        })
      );
      return;
    }
  });
});
app.get("/account", (req, res) => {
  //sends current user data to populate form
  let uid = sessions[req.cookies.sid];
  aliDb.users.findOne({ userId: uid }, (err, dbResult) => {
    if (err) {
      console.log(err);
    }
    console.log("user data retreived");
    res.send(JSON.stringify(dbResult));
  });
});

// Your endpoints go before this line

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
