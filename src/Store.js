import { createStore } from "redux";

let reducer = (state, action) => {
  if (action.type === "login-success") {
    return { ...state, loggedIn: true, currentUser: action.currentUser };
  }
  if (action.type === "signout") {
    return { ...state, loggedIn: false, currentUser: "" };
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
  return state;
};

const store = createStore(
  reducer,
  {
    currentUser: "t",
    loggedIn: true,
    allItems: [],
    searchQuery: "",
    orders: []
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
