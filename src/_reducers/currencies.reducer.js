import { currencyConstants } from '../_constants';

export function currencies(state = {}, action) {
    switch (action.type) {
        case currencyConstants.CREATE_REQUEST:
            return {
                loading: true,
                items: action.currencies
            };
        case currencyConstants.CREATE_SUCCESS:
            return {
                items: action.currencies
            };
        case currencyConstants.CREATE_FAILURE:
            return {
                error: action.error
            };
        case currencyConstants.GET_REQUEST:
            return {
                loading: true
            };
        case currencyConstants.GET_SUCCESS:
            return {
                items: action.currencies
            };
        case currencyConstants.GET_FAILURE:
            return {
                error: action.error
            };
        case currencyConstants.GETALL_REQUEST:
            return {
                loading: true,
                items: state.items //keep existing state during request
            };
        case currencyConstants.GETALL_SUCCESS:
            return {
                items: action.currencies
            };
        case currencyConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case currencyConstants.UPDATE_REQUEST:
            // add 'updating:true' property to currency being updated
            return {
                ...state,
                items: state.items.map(currency =>
                    currency.id === action.id
                        ? { ...currency, updating: true }
                        : currency
                )
            };
        case currencyConstants.UPDATE_SUCCESS:
            // update currency from state
            return {
                items: state.items.filter(currency => currency.id !== action.id)
            };
        case currencyConstants.UPDATE_FAILURE:
            // remove 'updating:true' property and add 'updateError:[error]' property to currency 
            return {
                ...state,
                items: state.items.map(currency => {
                    if (currency.id === action.id) {
                        // make copy of currency without 'updating:true' property
                        const { updating, ...currencyCopy } = currency;
                        // return copy of currency with 'updateError:[error]' property
                        return { ...currencyCopy, updateError: action.error };
                    }

                    return currency;
                })
            };
        case currencyConstants.DELETE_REQUEST:
            // add 'deleting:true' property to currency being deleted
            return {
                ...state,
                items: state.items.map(currency =>
                    currency.id === action.id
                        ? { ...currency, deleting: true }
                        : currency
                )
            };
        case currencyConstants.DELETE_SUCCESS:
            // remove deleted currency from state
            return {
                items: state.items.filter(currency => currency.id !== action.id)
            };
        case currencyConstants.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to currency 
            return {
                ...state,
                items: state.items.map(currency => {
                    if (currency.id === action.id) {
                        // make copy of currency without 'deleting:true' property
                        const { deleting, ...currencyCopy } = currency;
                        // return copy of currency with 'deleteError:[error]' property
                        return { ...currencyCopy, deleteError: action.error };
                    }

                    return currency;
                })
            };
        default:
            return state
    }
}