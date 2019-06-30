import { fieldnameConstants } from '../_constants';

export function fieldnames(state = {}, action) {
    switch (action.type) {
        case fieldnameConstants.CREATE_REQUEST:
            return {
                loading: true,
                items: action.fieldnames
            };
        case fieldnameConstants.CREATE_SUCCESS:
            return {
                items: action.fieldnames
            };
        case fieldnameConstants.CREATE_FAILURE:
            return {
                error: action.error
            };
        case fieldnameConstants.GET_REQUEST:
            return {
                loading: true
            };
        case fieldnameConstants.GET_SUCCESS:
            return {
                items: action.fieldnames
            };
        case fieldnameConstants.GET_FAILURE:
            return {
                error: action.error
            };
        case fieldnameConstants.GETALL_REQUEST:
            return {
                loading: true
            };
        case fieldnameConstants.GETALL_SUCCESS:
            return {
                items: action.fieldnames
            };
        case fieldnameConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case fieldnameConstants.UPDATE_REQUEST:
            // add 'updating:true' property to fieldname being updated
            return {
                ...state,
                items: state.items.map(fieldname =>
                    fieldname.id === action.id
                        ? { ...fieldname, updating: true }
                        : fieldname
                )
            };
        case fieldnameConstants.UPDATE_SUCCESS:
            // update fieldname from state
            return {
                items: state.items.filter(fieldname => fieldname.id !== action.id)
            };
        case fieldnameConstants.UPDATE_FAILURE:
            // remove 'updating:true' property and add 'updateError:[error]' property to fieldname 
            return {
                ...state,
                items: state.items.map(fieldname => {
                    if (fieldname.id === action.id) {
                        // make copy of fieldname without 'updating:true' property
                        const { updating, ...fieldnameCopy } = fieldname;
                        // return copy of fieldname with 'updateError:[error]' property
                        return { ...fieldnameCopy, updateError: action.error };
                    }

                    return fieldname;
                })
            };
        case fieldnameConstants.DELETE_REQUEST:
            // add 'deleting:true' property to fieldname being deleted
            return {
                ...state,
                items: state.items.map(fieldname =>
                    fieldname.id === action.id
                        ? { ...fieldname, deleting: true }
                        : fieldname
                )
            };
        case fieldnameConstants.DELETE_SUCCESS:
            // remove deleted fieldname from state
            return {
                items: state.items.filter(fieldname => fieldname.id !== action.id)
            };
        case fieldnameConstants.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to fieldname 
            return {
                ...state,
                items: state.items.map(fieldname => {
                    if (fieldname.id === action.id) {
                        // make copy of fieldname without 'deleting:true' property
                        const { deleting, ...fieldnameCopy } = fieldname;
                        // return copy of fieldname with 'deleteError:[error]' property
                        return { ...fieldnameCopy, deleteError: action.error };
                    }

                    return fieldname;
                })
            };
        default:
            return state
    }
}