import axios from "axios";
import { USERS } from "./types";

import baseUrl from "../config";

export async function getUsers() {
  return (dispatch) => {
    axios
      .get("http://localhost:8080/user/get_user")
      .then((res) => {
        console.log(res);
        dispatch({
          type: USERS,
          payload: res.data,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
}
