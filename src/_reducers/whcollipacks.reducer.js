import { whcollipackConstants } from '../_constants';

export function whcollipacks(state = {}, action) {
    switch (action.type) {
        case whcollipackConstants.GETALL_REQUEST:
            return {
                loadingWhcollipacks: true,
                items: state.items //keep existing state during request
            };
        case whcollipackConstants.GETALL_SUCCESS:
            return {
                items: action.whcollipacks
            };
        case whcollipackConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case whcollipackConstants.CLEAR:
            return {};
        default:
            return state
    }
}