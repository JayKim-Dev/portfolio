import axios from "axios";
import { properties } from "../../properties";

export const DEPARTMENT = "DEPARTMENT";

// action
export const departmentData = (data) => {
  return {
    type: DEPARTMENT,
    data,
  };
};

export const department = () => {
  return (dispatch) => {
    return axios
      .get(`${properties.url}/department`)
      .then((res) => {
        dispatch(departmentData(res.data.data));
      })
      .catch((error) => {
        console.error(error);
      });
  };
};
