import { userConstants } from '../_constants';

export function requestpwd(state = {}, action) {
  switch (action.type) {
    case userConstants.REQUESTPWD_REQUEST:
      return { requesting: true };
    case userConstants.REQUESTPWD_SUCCESS:
      return {};
    case userConstants.REQUESTPWD_FAILURE:
      return {};
    default:
      return state
  }
}