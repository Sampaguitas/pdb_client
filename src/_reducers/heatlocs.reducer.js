import { heatlocConstants } from '../_constants';

export function heatlocs(state = {}, action) {
    switch (action.type) {
        case heatlocConstants.GETALL_REQUEST:
            return {
                loadingHeatlocs: true,
                items: state.items
            };
        case heatlocConstants.GETALL_SUCCESS:
            return {
                items: action.heatlocs
            };
        case heatlocConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case heatlocConstants.CLEAR:
            return {};
        default:
            return state
    }
}