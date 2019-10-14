import { accessConstants } from '../_constants';

export function accesses(state = {}, action) {
    switch (action.type) {
        case accessConstants.CREATE_REQUEST:
            return {
                loading: true,
                items: action.accesses
            };
        case accessConstants.CREATE_SUCCESS:
            return {
                items: action.accesses
            };
        case accessConstants.CREATE_FAILURE:
            return {
                error: action.error
            };
        case accessConstants.GET_REQUEST:
            return {
                loading: true
            };
        case accessConstants.GET_SUCCESS:
            return {
                items: action.accesses
            };
        case accessConstants.GET_FAILURE:
            return {
                error: action.error
            };
        case accessConstants.GETALL_REQUEST:
            return {
                loading: true
            };
        case accessConstants.GETALL_SUCCESS:
            return {
                items: action.accesses
            };
        case accessConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case accessConstants.UPDATE_REQUEST:
            // add 'updating:true' property to access being updated
            return {
                ...state,
                items: state.items.map(access =>
                    access.id === action.id
                        ? { ...access, updating: true }
                        : access
                )
            };
        case accessConstants.UPDATE_SUCCESS:
            // update access from state
            return {
                items: state.items.filter(access => access.id !== action.id)
            };
        case accessConstants.UPDATE_FAILURE:
            // remove 'updating:true' property and add 'updateError:[error]' property to access 
            return {
                ...state,
                items: state.items.map(access => {
                    if (access.id === action.id) {
                        // make copy of access without 'updating:true' property
                        const { updating, ...accessCopy } = access;
                        // return copy of access with 'updateError:[error]' property
                        return { ...accessCopy, updateError: action.error };
                    }

                    return access;
                })
            };
        case accessConstants.DELETE_REQUEST:
            // add 'deleting:true' property to access being deleted
            return {
                ...state,
                items: state.items.map(access =>
                    access.id === action.id
                        ? { ...access, deleting: true }
                        : access
                )
            };
        case accessConstants.DELETE_SUCCESS:
            // remove deleted access from state
            return {
                items: state.items.filter(access => access.id !== action.id)
            };
        case accessConstants.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to access 
            return {
                ...state,
                items: state.items.map(access => {
                    if (access.id === action.id) {
                        // make copy of access without 'deleting:true' property
                        const { deleting, ...accessCopy } = access;
                        // return copy of access with 'deleteError:[error]' property
                        return { ...accessCopy, deleteError: action.error };
                    }

                    return access;
                })
            };
        case accessConstants.CLEAR:
            return {};
        default:
            return state
    }
}