import { createStore } from "redux";

function changeTheme(state = "dark", action) {
  return (state = action.type);
}

export let store = createStore(changeTheme);
