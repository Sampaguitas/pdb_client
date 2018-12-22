import { customerConstants } from '../_constants';

export function customers(state = {}, action) {
    switch (action.type) {
        case customerConstants.CREATE_REQUEST:
            return {
                loading: true,
                items: action.customers
            };
        case customerConstants.CREATE_SUCCESS:
            return {
                items: action.customers
            };
        case customerConstants.CREATE_FAILURE:
            return {
                error: action.error
            };
        case customerConstants.GET_REQUEST:
            return {
                loading: true
            };
        case customerConstants.GET_SUCCESS:
            return {
                items: action.customers
            };
        case customerConstants.GET_FAILURE:
            return {
                error: action.error
            };
        case customerConstants.GETALL_REQUEST:
            return {
                loading: true
            };
        case customerConstants.GETALL_SUCCESS:
            return {
                items: action.customers
            };
        case customerConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case customerConstants.UPDATE_REQUEST:
            // add 'updating:true' property to customer being updated
            return {
                ...state,
                items: state.items.map(customer =>
                    customer.id === action.id
                        ? { ...customer, updating: true }
                        : customer
                )
            };
        case customerConstants.UPDATE_SUCCESS:
            // update customer from state
            return {
                items: state.items.filter(customer => customer.id !== action.id)
            };
        case customerConstants.UPDATE_FAILURE:
            // remove 'updating:true' property and add 'updateError:[error]' property to customer 
            return {
                ...state,
                items: state.items.map(customer => {
                    if (customer.id === action.id) {
                        // make copy of customer without 'updating:true' property
                        const { updating, ...customerCopy } = customer;
                        // return copy of customer with 'updateError:[error]' property
                        return { ...customerCopy, updateError: action.error };
                    }

                    return customer;
                })
            };
        case customerConstants.DELETE_REQUEST:
            // add 'deleting:true' property to customer being deleted
            return {
                ...state,
                items: state.items.map(customer =>
                    customer.id === action.id
                        ? { ...customer, deleting: true }
                        : customer
                )
            };
        case customerConstants.DELETE_SUCCESS:
            // remove deleted customer from state
            return {
                items: state.items.filter(customer => customer.id !== action.id)
            };
        case customerConstants.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to customer 
            return {
                ...state,
                items: state.items.map(customer => {
                    if (customer.id === action.id) {
                        // make copy of customer without 'deleting:true' property
                        const { deleting, ...customerCopy } = customer;
                        // return copy of customer with 'deleteError:[error]' property
                        return { ...customerCopy, deleteError: action.error };
                    }

                    return customer;
                })
            };
        default:
            return state
    }
}