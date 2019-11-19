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
const itemSearch = searchObj => {
  let searchResults = new Promise((resolve, reject) => {
    if (aliDb === undefined) {
      setTimeout();
    }
    let queries = Object.keys(searchObj);
    let found = Promise.all(
      queries.map(query => {
        if (query == "title" || query == "description" || query == "location") {
          aliDb
            .collection("items")
            .find({
              $text: { $search: searchObj[query], $caseSensitive: false }
            })
            .toArray((err, result) => {
              if (err) {
                console.log(err);
              }
              return result;
            });
        }
        if (query === searchObj[minPrice]) {
          aliDb
            .collection("items")
            .find({ price: { $gt: searchObj.minPrice } })
            .toArray((err, result) => {
              if (err) {
                console.log(err);
              }
              return result;
            });
        }
        if (query === searchObj[maxPrice]) {
          aliDb
            .collection("items")
            .find({ price: { $lt: searchObj.maxPrice } })
            .toArray((err, result) => {
              if (err) {
                console.log(err);
              }
              return result;
            });
        }
      })
    ).then(result => {
      result.forEach(item => {
        console.log(item);
      });
      resolve({ success: true, data: result });
    });
  });
  return searchResults;
};

//updating user data
const updateUser = (userData, req) => {
  const newData = req.body;
  const updatedUser = { ...userData, ...newData };
  return updatedUser;
};

// Your endpoints go after this line

app.post("/items", upload.none(), (req, res) => {
  //sends an array of itemData objects if body.search is undefined
  //WIP - expects body.search to be a JSON formatted object
  //possible (but not required properties) are:
  //keyword, minPrice, maxPrice, location
  console.log("POST: /items");
  let query = {};
  if (req.body.search === undefined) {
    aliDb
      .collection("items")
      .find(query)
      .toArray((err, data) => {
        if (err) {
          console.log(err);
        }
        console.log("data retreived " + data.length + " items");
        let pkg = data;
        res.send(pkg);
      });
  }
});

//user authentication endpoints------------------------------------------------------------------------------------------
app.post("/login", upload.none(), (req, res) => {
  // testing endpoint

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
  // start real endpoint
  const sid = req.cookies.sid;
  if (sessions[sid] != undefined) {
    console.log("active session found");
    let pkg = { success: true };
    res.send(JSON.stringify(pkg));
    return;
  } else {
    const userGiven = req.body.username;
    aliDb
      .collection("auth")
      .findOne({ username: userGiven }, (err, dbResult) => {
        if (err) {
          console.log(err);
        }
        console.log("user auth retrevied");
        let chal = dbResult.password;
        if (auth.verify(req.body.password, chal)) {
          console.log("logged in " + dbResult.username);
          let pkg = { success: true };
          let newSid = tools.generateId(6);
          sessions[newSid] = dbResult.id;
          res.cookie("sid", newSid);
          res.send(JSON.stringify(pkg));
          return;
        } else {
          let pkg = { success: false, msg: "invalid username or password" };
          res.send(JSON.stringify(pkg));
          return;
        }
      });
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
  aliDb
    .collection("auth")
    .find({ username: userGiven })
    .toArray((err, dbResult) => {
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
        let hpass = auth.generate(req.body.password);
        let uid = tools.generateId(6);
        aliDb
          .collection("auth")
          .insertOne(
            { username: userGiven, password: hpass, id: uid },
            (err, dbResult) => {
              if (err) {
                console.log(err);
              }
              console.log("user auth info stored");
              let pkg = { success: true };
              res.send(JSON.stringify(pkg));
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
        aliDb.collection("users").insertOne(
          userdata,
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
  //expects formdata with the following fields:
  //title, price, description, location, image, largeImage
  console.log("POST:/additem");
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
    aliDb.collection("items").insertOne(newItem, (err, result) => {
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
});

app.get("/cart", (req, res) => {
  // sends a json formatted array of itemData objects
  console.log("GET: /cart");
  const uid = sessions[req.cookies.sid];
  retreive("users", { userId: uid }, aliDb).then(dbResult => {
    console.log("db return:");
    console.log(dbResult);
    let userData = dbResult.data;
    let cart = userData.cart;
    Promise.all(
      cart.map(itemId => {
        return retreive("items", { id: itemId }, aliDb).then(dbResult => {
          return dbResult.data;
        });
      })
    ).then(result => {
      res.send(JSON.stringify(result));
    });
  });
});

app.post("/cart", upload.none(), (req, res) => {
  //expects body with adding:true if adding and adding:false if removing, and itemId:string id of item
  const uid = sessions[req.cookies.sid];
  retreive("users", { userId: uid }, aliDb).then(dbResult => {
    let userData = dbResult.userdata;
    let oldCart = userData.cart;
    let newCart = [];
    if (req.body.adding) {
      newCart = oldCart.concat(req.body.itemId);
    } else {
      newCart = oldCart.filter(id => {
        if (id === req.body.itemId) {
          return false;
        }
        return true;
      });
    }
    userData = { ...userData, cart: newCart };
    aliDb
      .collection("users")
      .updateOne({ userId: userData.userId }, userData, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log("new cart written to db");
        res.send(JSON.stringify({ success: true }));
      });
  });
});

app.get("/checkout", (req, res) => {
  const uid = sessions[req.cookies.sid];
  aliDb.collection("users").findOne({ userId: uid }, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(JSON.stringify(result.paymentMethods));
  });
});

app.post("/checkout", upload.none(), (req, res) => {
  //expects cart:array of itemIds, paymentInfo:
  const uid = sessions[req.cookies.sid];
  let items = req.body.cart;
  Promise.all((resolve, reject) => {
    items.map(id => {
      retreive("items", { itemId: id }, aliDb).then(dbResult => {
        if (!dbResult.success) {
          console.log(err);
          reject("database error");
        }
        console.log(dbResult);
        resolve(dbResult.data);
      });
    });
  }).then(cartItems => {
    let total = 0;
    cartItems.forEach(item => {
      total = total + item.price;
    });
  });

  aliDb.collection("users").findOne({ userId: uid }, (err, result) => {
    if (err) {
      console.log(err);
    }
  });
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
        .collection("users")
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
  aliDb.collection("users").findOne({ userId: uid }, (err, dbResult) => {
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

module.exports = { itemSearch };
