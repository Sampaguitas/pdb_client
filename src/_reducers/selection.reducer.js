import { projectConstants } from '../_constants';

export function selection(state = {}, action) {
  switch (action.type) {
    case projectConstants.GET_REQUEST:
      return {
        loadingSelection: true,
        // project: action.project
        project: state.project //keep existing state during request
      };
    case projectConstants.GET_SUCCESS:
      return {
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