const itemSearch = (searchObj, aliDb) => {
  let searchResults = new Promise((resolve, reject) => {
    if (aliDb === undefined) {
      setTimeout();
    }
    let queries = Object.keys(searchObj);
    let found = Promise.all(
      queries.map(async query => {
        console.log(query);
        if (query == "title" || query == "description" || query == "location") {
          console.log("search for" + query + searchObj[query]);
          let result = await aliDb
            .collection("items")
            .find({
              $text: { $search: searchObj[query], $caseSensitive: false }
            })
            .toArray((err, result) => {
              if (err) {
                console.log(err);
              }
              console.log(result);
              return result;
            });
          console.log(result);
        }
        if (query === "minPrice") {
          console.log("search for minPrice " + searchObj.minPrice);
          let result = await aliDb
            .collection("items")
            .find({ price: { $gt: searchObj.minPrice } })
            .toArray((err, result) => {
              if (err) {
                console.log(err);
              }
              console.log(result);
            });
          console.log("minprice " + result);
        }
        if (query === "maxPrice") {
          console.log("search for maxPrice " + searchObj.maxPrice);
          let result = await aliDb
            .collection("items")
            .find({ price: { $lt: searchObj.maxPrice } })
            .toArray((err, result) => {
              if (err) {
                console.log(err);
              }
              console.log(result);
              return result;
            });
          console.log(result);
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

module.exports = itemSearch;
