import { combineReducers } from "redux";
import DepartmentReducer from "./reducerDepartment";
import sidebarShow from "./reducerSidebarShow";

const rootReducer = combineReducers({
  sidebarShow,
  dept: DepartmentReducer,
});

export default rootReducer;
