import { pickticketConstants } from '../_constants';

export function picktickets(state = {}, action) {
    switch (action.type) {
        case pickticketConstants.GETALL_REQUEST:
            return {
                loadingPicktickets: true,
                items: state.items
            };
        case pickticketConstants.GETALL_SUCCESS:
            return {
                items: action.picktickets
            };
        case pickticketConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case pickticketConstants.CLEAR:
            return {};
        default:
            return state
    }
}