import { projectConstants } from '../_constants';

export function selection(state = {}, action) {
  switch (action.type) {
    case projectConstants.GET_REQUEST:
      return {
        selecting: true,
        project: action.project
      };
    case projectConstants.GET_SUCCESS:
      return {
        selected: true,
        project: action.project
      };
    case projectConstants.GET_FAILURE:
      return {};
    default:
      return state
  }
}