import { DEPARTMENT } from "../action/index";
import { initialState } from "../initialState";

export default function (state = initialState, action) {
  switch (action.type) {
    case DEPARTMENT:
      return {
        ...state,
        department: action.data,
      };
    default:
      return state;
  }
}
