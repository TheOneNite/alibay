//libraries
const tools = require("./custom_modules/tools.js");

//setup and initialzie mongo db
const mongoClient = require("mongodb").MongoClient;
const dbCredientials = require("./mongo/dbURI.js");

const fs = require("fs");

const updateDb = () => {
  const aliDb = mongoDb.db("alibay");
  aliDb
    .collection("items")
    .find({})
    .toArray((err, result) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log("items retreived from db");
      result.forEach(dbDoc => {
        aliDb
          .collection("items")
          .updateOne(
            { itemId: dbDoc.itemId },
            { $set: { sellerId: "msdaxt" } },
            (err, result) => {
              if (err) {
                console.log(err);
                return;
              }
              console.log("add time to order " + result.itemId);
            }
          );
      });
    });
};

let mongoDb = undefined;
mongoClient.connect(dbCredientials, (err, dbRef) => {
  if (err) {
    console.log(err);
  }
  mongoDb = dbRef;
  console.log("-----------database initialized-----------");
  updateDb();
});
