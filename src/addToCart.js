let addToCart = (itemId, dispatch) => {
  console.log("adding to cart");
  let updateCart = async () => {
    console.log("updating cart...");
    let response = await fetch("/fetch-cart", {
      method: "GET"
    });
    let body = await response.text();
    let returnedCart = JSON.parse(body);
    console.log("returnedCart", returnedCart);
    dispatch({ type: "updateCart", cart: returnedCart });
  };

  addToCart = async () => {
    console.log("attempting to add to cart");
    let data = new FormData();
    data.append("adding", true);
    data.append("itemId", itemId);
    console.log("itemId: ", itemId);
    let res = await fetch("/cart", {
      method: "POST",
      body: data,
      credentials: "include"
    });
    let body = await res.text();
    let response = JSON.parse(body);
    if (!response.success) {
      alert("add to cart failed");
      return;
    }
    alert("item added to cart");
    updateCart();
  };
};

export default addToCart;
