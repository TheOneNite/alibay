import { createStore } from "redux";

const INITIAL_STATE = {
  currentUser: "",
  loggedIn: false,
  allItems: [],
  searchQuery: "",
  orders: [],
  cart: []
};

let reducer = (state, action) => {
  if (action.type === "login-success") {
    return { ...state, loggedIn: true, currentUser: action.currentUser };
  }
  if (action.type === "signout") {
    return INITIAL_STATE;
  }
  if (action.type === "allItems") {
    return { ...state, allItems: action.items };
  }
  if (action.type === "searchQuery") {
    return { ...state, searchQuery: action.search };
  }
  if (action.type === "orders") {
    return { ...state, orders: action.orders };
  }
  if (action.type === "updateCart") {
    return { ...state, cart: action.cart };
  }
  return state;
};
localStorage.removeItem("alibay_state");
const store = createStore(
  reducer,
  INITIAL_STATE,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
