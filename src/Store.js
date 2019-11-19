import { createStore } from "redux";

let reducer = (state, action) => {
  if (action.type === "login-success") {
    return { ...state, loggedIn: true, currentUser: action.currentUser };
  }
  if (action.type === "signout") {
    return { ...state, loggedIn: false, currentUser: "" };
  }
  if (action.type === "displayItems") {
    return { ...state, displayedItems: action.items };
  }
  if (action.type === "searchQuery") {
    return { ...state, searchQuery: action.search };
  }
  return state;
};

const store = createStore(
  reducer,
  {
    currentUser: "",
    loggedIn: false,
    allItems: [],
    displayedItems: [],
    searchQuery: ""
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
