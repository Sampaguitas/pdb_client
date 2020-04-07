import { collitypeConstants } from '../_constants';

export function collitypes(state = {}, action) {
    switch (action.type) {
        case collitypeConstants.GETALL_REQUEST:
            return {
                loadingCollipacks: true,
                items: state.items
            };
        case collitypeConstants.GETALL_SUCCESS:
            return {
                items: action.collitypes
            };
        case collitypeConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case collitypeConstants.CLEAR:
            return {};
        default:
            return state
    }
}