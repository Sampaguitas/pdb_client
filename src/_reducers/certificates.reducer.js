import { certificateConstants } from '../_constants';

export function certificates(state = {}, action) {
    switch (action.type) {
        case certificateConstants.GETALL_REQUEST:
            return {
                loadingCertificates: true,
                items: state.items
            };
        case certificateConstants.GETALL_SUCCESS:
            return {
                items: action.certificates
            };
        case certificateConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case certificateConstants.CLEAR:
            return {};
        default:
            return state
    }
}