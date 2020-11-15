import { applyMiddleware, createStore } from "redux";
import ReduxThunk from "redux-thunk";
import Reducer from "./reducer/index";
import "./action/index";
import { department } from "./action/index";

const store = createStore(Reducer, applyMiddleware(ReduxThunk));
store.dispatch(department());

export default store;
