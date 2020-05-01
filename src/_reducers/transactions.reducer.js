import { transactionConstants } from '../_constants';

export function transactions(state = {}, action) {
    switch (action.type) {
        case transactionConstants.GETALL_REQUEST:
            return {
                loadingTransactions: true,
                items: state.items
            };
        case transactionConstants.GETALL_SUCCESS:
            return {
                items: action.transactions
            };
        case transactionConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case transactionConstants.CLEAR:
            return {};
        default:
            return state
    }
}