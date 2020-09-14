import { USERS } from "../Actions/types";

const initialState = {
  user: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USERS: {
      return {
        ...state,
        users: action.payload.user,
      };
    }

    default:
      return state;
  }
}
