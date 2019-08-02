import { userConstants } from '../_constants';

export function resetpwd(state = {}, action) {
  switch (action.type) {
    case userConstants.RESETPWD_REQUEST:
      return { reseting: true };
    case userConstants.RESETPWD_SUCCESS:
      return {};
    case userConstants.RESETPWD_FAILURE:
      return {};
    default:
      return state
  }
}