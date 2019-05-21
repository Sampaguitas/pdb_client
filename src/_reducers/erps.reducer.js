import { erpConstants } from '../_constants';

export function erps(state = {}, action) {
    switch (action.type) {
        case erpConstants.CREATE_REQUEST:
            return {
                loading: true,
                items: action.erps
            };
        case erpConstants.CREATE_SUCCESS:
            return {
                items: action.erps
            };
        case erpConstants.CREATE_FAILURE:
            return {
                error: action.error
            };
        case erpConstants.GET_REQUEST:
            return {
                loading: true
            };
        case erpConstants.GET_SUCCESS:
            return {
                items: action.erps
            };
        case erpConstants.GET_FAILURE:
            return {
                error: action.error
            };
        case erpConstants.GETALL_REQUEST:
            return {
                loading: true
            };
        case erpConstants.GETALL_SUCCESS:
            return {
                items: action.erps
            };
        case erpConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case erpConstants.UPDATE_REQUEST:
            // add 'updating:true' property to erp being updated
            return {
                ...state,
                items: state.items.map(erp =>
                    erp.id === action.id
                        ? { ...erp, updating: true }
                        : erp
                )
            };
        case erpConstants.UPDATE_SUCCESS:
            // update erp from state
            return {
                items: state.items.filter(erp => erp.id !== action.id)
            };
        case erpConstants.UPDATE_FAILURE:
            // remove 'updating:true' property and add 'updateError:[error]' property to erp 
            return {
                ...state,
                items: state.items.map(erp => {
                    if (erp.id === action.id) {
                        // make copy of erp without 'updating:true' property
                        const { updating, ...erpCopy } = erp;
                        // return copy of erp with 'updateError:[error]' property
                        return { ...erpCopy, updateError: action.error };
                    }

                    return erp;
                })
            };
        case erpConstants.DELETE_REQUEST:
            // add 'deleting:true' property to erp being deleted
            return {
                ...state,
                items: state.items.map(erp =>
                    erp.id === action.id
                        ? { ...erp, deleting: true }
                        : erp
                )
            };
        case erpConstants.DELETE_SUCCESS:
            // remove deleted erp from state
            return {
                items: state.items.filter(erp => erp.id !== action.id)
            };
        case erpConstants.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to erp 
            return {
                ...state,
                items: state.items.map(erp => {
                    if (erp.id === action.id) {
                        // make copy of erp without 'deleting:true' property
                        const { deleting, ...erpCopy } = erp;
                        // return copy of erp with 'deleteError:[error]' property
                        return { ...erpCopy, deleteError: action.error };
                    }

                    return erp;
                })
            };
        default:
            return state
    }
}