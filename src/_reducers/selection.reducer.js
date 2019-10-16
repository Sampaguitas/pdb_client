import { projectConstants } from '../_constants';

export function selection(state = {}, action) {
  switch (action.type) {
    case projectConstants.GET_REQUEST:
      return {
        selecting: true,
        selected: false,
        project: action.project
      };
    case projectConstants.GET_SUCCESS:
      return {
        selecting: false,
        selected: true,
        project: action.project
      };
    case projectConstants.GET_FAILURE:
      return {};
    case projectConstants.CLEAR_SELECTION:
        return {};    
    default:
      return state
  }
}