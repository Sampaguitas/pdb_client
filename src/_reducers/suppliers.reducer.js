import { supplierConstants } from '../_constants';

export function suppliers(state = {}, action) {
    switch (action.type) {
        case supplierConstants.CREATE_REQUEST:
            return {
                loading: true,
                items: action.suppliers
            };
        case supplierConstants.CREATE_SUCCESS:
            return {
                items: action.suppliers
            };
        case supplierConstants.CREATE_FAILURE:
            return {
                error: action.error
            };
        case supplierConstants.GET_REQUEST:
            return {
                loading: true
            };
        case supplierConstants.GET_SUCCESS:
            return {
                items: action.suppliers
            };
        case supplierConstants.GET_FAILURE:
            return {
                error: action.error
            };
        case supplierConstants.GETALL_REQUEST:
            return {
                loading: true,
                items: state.items //keep existing state during request
            };
        case supplierConstants.GETALL_SUCCESS:
            return {
                items: action.suppliers
            };
        case supplierConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case supplierConstants.UPDATE_REQUEST:
            // add 'updating:true' property to supplier being updated
            return {
                ...state,
                items: state.items.map(supplier =>
                    supplier.id === action.id
                        ? { ...supplier, updating: true }
                        : supplier
                )
            };
        case supplierConstants.UPDATE_SUCCESS:
            // update supplier from state
            return {
                items: state.items.filter(supplier => supplier.id !== action.id)
            };
        case supplierConstants.UPDATE_FAILURE:
            // remove 'updating:true' property and add 'updateError:[error]' property to supplier 
            return {
                ...state,
                items: state.items.map(supplier => {
                    if (supplier.id === action.id) {
                        // make copy of supplier without 'updating:true' property
                        const { updating, ...supplierCopy } = supplier;
                        // return copy of supplier with 'updateError:[error]' property
                        return { ...supplierCopy, updateError: action.error };
                    }

                    return supplier;
                })
            };
        case supplierConstants.DELETE_REQUEST:
            // add 'deleting:true' property to supplier being deleted
            return {
                ...state,
                items: state.items.map(supplier =>
                    supplier.id === action.id
                        ? { ...supplier, deleting: true }
                        : supplier
                )
            };
        case supplierConstants.DELETE_SUCCESS:
            // remove deleted supplier from state
            return {
                items: state.items.filter(supplier => supplier.id !== action.id)
            };
        case supplierConstants.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to supplier 
            return {
                ...state,
                items: state.items.map(supplier => {
                    if (supplier.id === action.id) {
                        // make copy of supplier without 'deleting:true' property
                        const { deleting, ...supplierCopy } = supplier;
                        // return copy of supplier with 'deleteError:[error]' property
                        return { ...supplierCopy, deleteError: action.error };
                    }

                    return supplier;
                })
            };
        case supplierConstants.CLEAR:
            return {};
        default:
            return state
    }
}