//libraries setup
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const multer = require("multer");
const upload = multer();

const auth = require("password-hash");

const stripeKey = require("./custom_modules/stripeKeys.js");
const stripe = require("stripe")(stripeKey.private);

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
  const newData = JSON.parse(req.body.update);
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
          res.send(
            JSON.stringify({
              success: false,
              msg: "auth info could not be retreived"
            })
          );
          return;
        }
        console.log("user auth retrevied");
        if (dbResult === null) {
          res.send(
            JSON.stringify({ success: false, msg: "invalid username password" })
          );
          return;
        }
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
          email: req.body.email,
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
      res.send(JSON.stringify({ success: true, item: newItem }));
      return;
    });
  });
});

app.get("/fetch-cart", (req, res) => {
  // sends a json formatted array of itemData objects
  console.log("GET: /cart");
  const uid = sessions[req.cookies.sid];
  retreive("users", { userId: uid }, aliDb).then(dbResult => {
    console.log("db user info retreived");
    let userData = dbResult.data;
    let cart = userData.cart;
    if (cart === undefined || cart.length < 1) {
      res.send(JSON.stringify([]));
      return;
    }
    Promise.all(
      cart.map(itemId => {
        return retreive("items", { itemId: itemId }, aliDb).then(dbResult => {
          console.log(dbResult);
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
    if (dbResult.success === false) {
      console.log(dbResult.err);
      res.send({ success: false, msg: "user data not found" });
      return;
    }
    let userData = dbResult.data;
    console.log(userData);
    let oldCart = userData.cart;
    let newCart = [];
    let isAdd = JSON.parse(req.body.adding);
    console.log("adding:" + isAdd);
    if (isAdd) {
      console.log("adding to cart");
      newCart = oldCart.concat(req.body.itemId);
    }
    if (isAdd === false) {
      console.log("removing from cart");
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
      .updateOne(
        { userId: userData.userId },
        { $set: { ...userData } },
        (err, result) => {
          if (err) {
            console.log(err);
            res.send({ success: false, msg: "writing cart to db failed" });
            return;
          }
          console.log("new cart written to db");
          res.send(JSON.stringify({ success: true, cart: newCart }));
        }
      );
  });
});

app.get("/checkout", (req, res) => {
  // sends an array of payment method objects and and array of
  const uid = sessions[req.cookies.sid];
  aliDb.collection("users").findOne({ userId: uid }, (err, result) => {
    if (err) {
      console.log(err);
    }
    res.send(
      JSON.stringify({ cart: result.cart, payments: result.paymentMethods })
    );
  });
});

app.post("/checkout", upload.none(), (req, res) => {
  console.log("submitting payment details to stripe");
  const processPayment = async (total, token) => {
    let charge = await stripe.charges.create({
      amount: total,
      currency: "usd",
      source: token
    });
    return charge;
  };
  console.log("POST: /checkout");
  //expects cart:array of itemIds, paymentInfo:
  const uid = sessions[req.cookies.sid];
  let clientTotal = req.body.total;
  let token = req.body.token;
  let items = JSON.parse(req.body.cart);
  console.log("checking out");
  Promise.all(
    items.map(id => {
      return retreive("items", { itemId: id }, aliDb).then(dbResult => {
        if (!dbResult.success) {
          console.log(err);
          return { success: false };
        }
        console.log("item data retreived for " + dbResult.data.itemId);
        return dbResult.data;
      });
    })
  ).then(cartItems => {
    let subtotal = 0;
    cartItems.forEach(item => {
      subtotal = subtotal + item.price;
    });
    let total = subtotal;
    let newOrder = {
      orderId: tools.generateId(8),
      items: cartItems,
      total: total
    };
    processPayment(clientTotal, token).then(charge => {
      console.log("payment result");
      console.log(charge);
      if (!charge.paid) {
        console.log("payment failed");
        res.send(
          JSON.stringify({
            success: false,
            msg: "payment could not be processed"
          })
        );
        return;
      }
      let orderMerchants = [];
      cartItems.forEach(itemData => {
        if (orderMerchants.includes(itemData.sellerId)) {
          return;
        }
        orderMerchants.push(itemData.sellerId);
      });
      let saleOrders = {};
      orderMerchants.forEach(sellerId => {
        let orderItems = cartItems.filter(itemData => {
          if (itemData.sellerId === sellerId) {
            return true;
          }
          return false;
        });
        let orderTotal = 0;
        orderItems.forEach(itemData => {
          orderTotal = orderTotal + itemData.price;
        });
        saleOrders[sellerId] = {
          orderId: tools.generateId(8),
          items: orderItems,
          total: orderTotal
        };
      });
      dbOrders = [];
      orderMerchants.forEach(merchantId => {
        dbOrders.push(saleOrders[merchantId]);
        aliDb
          .collection("users")
          .findOne({ userId: merchantId }, (err, result) => {
            if (err) {
              console.log(err);
            }
            console.log("merchant user info retreived");
            let userData = result;
            let newOrders = userData.sales.concat(
              saleOrders[merchantId].orderId
            );
            aliDb
              .collection("users")
              .updateOne(
                { userId: merchantId },
                { $set: { ...userData, sales: newOrders } },
                (err, result) => {
                  if (err) {
                    console.log(err);
                  }
                  console.log("merchant order history updated");
                }
              );
          });
      });
      aliDb.collection("orders").insertMany(dbOrders, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log("pushed " + dbOrders.length + " merchant orders to db");
      });
      aliDb.collection("orders").insertOne(newOrder, (err, result) => {
        if (err) {
          console.log(err);
          res.send({ success: false });
          return;
        }
        console.log("order pushed to db:");
      });
      retreive("users", { userId: uid }, aliDb).then(dbResult => {
        if (dbResult.success === false) {
          console.log(dbResult.err);
          res.send({ success: false });
          return;
        }
        console.log("user info retreived from db for order history");
        let userData = dbResult.data;
        let newHistory = userData.orders.concat(newOrder.orderId);
        aliDb
          .collection("users")
          .updateOne(
            { userId: userData.userId },
            { $set: { ...userData, orders: newHistory, cart: [] } },
            (err, result) => {
              if (err) {
                console.log(err);
                res.send({ success: false });
                return;
              }
              console.log(
                "order history updated for user " + userData.displayName
              );
              res.send({ success: true });
            }
          );
      });
    });
  });

  aliDb.collection("users").findOne({ userId: uid }, (err, result) => {
    if (err) {
      console.log(err);
    }
  });
});

app.get("/orders", (req, res) => {
  // sends an array of order data objects
  console.log("GET: /orders");
  let uid = sessions[req.cookies.sid];
  aliDb.collection("users").findOne({ userId: uid }, (err, result) => {
    if (err) {
      console.log(err);
      res.send({ success: false, msg: "user data could not be found" });
    }
    console.log("user data retreived");
    let userData = result;
    let orders = userData.orders;
    Promise.all(
      orders.map(orderId => {
        return retreive("orders", { orderId: orderId }, aliDb).then(result => {
          if (result.success === false) {
            console.log(result.err);
            return result;
          }
          return result.data;
        });
      })
    ).then(orderData => {
      res.send(JSON.stringify(orderData));
    });
  });
});

//account management endpoints---------------------------------------------------------------------------------------
app.post("/account", upload.none(), (req, res) => {
  console.log("POST: /account");
  //updates user info from form submission
  let userData = {};
  const uid = sessions[req.cookies.sid];
  retreive("users", { userId: uid }, aliDb).then(dbResult => {
    const mongoUid = dbResult.data._id;
    if (dbResult.success) {
      console.log("user data retreived");
      userData = dbResult.data;
      userData = updateUser(userData, req);
      console.log("user data updated");
      aliDb
        .collection("users")
        .updateOne(
          { userId: uid },
          { $set: { ...userData } },
          (err, result) => {
            if (err) {
              console.log(err);
            }
            console.log("account information updated");
            res.send(JSON.stringify({ success: true, data: result }));
            return;
          }
        );
      return;
    } else {
      console.log(dbResult.err);
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
    console.log(dbResult);
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
