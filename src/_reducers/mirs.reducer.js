import { mirConstants } from '../_constants';

export function mirs(state = {}, action) {
    switch (action.type) {
        case mirConstants.GETALL_REQUEST:
            return {
                loadingMirs: true,
                items: state.items
            };
        case mirConstants.GETALL_SUCCESS:
            return {
                items: action.mirs
            };
        case mirConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case mirConstants.CLEAR:
            return {};
        default:
            return state
    }
}