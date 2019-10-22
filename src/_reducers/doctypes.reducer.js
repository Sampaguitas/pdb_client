import { doctypeConstants } from '../_constants';

export function doctypes(state = {}, action) {
    switch (action.type) {
        case doctypeConstants.CREATE_REQUEST:
            return {
                loading: true,
                items: action.doctypes
            };
        case doctypeConstants.CREATE_SUCCESS:
            return {
                items: action.doctypes
            };
        case doctypeConstants.CREATE_FAILURE:
            return {
                error: action.error
            };
        case doctypeConstants.GET_REQUEST:
            return {
                loading: true
            };
        case doctypeConstants.GET_SUCCESS:
            return {
                items: action.doctypes
            };
        case doctypeConstants.GET_FAILURE:
            return {
                error: action.error
            };
        case doctypeConstants.GETALL_REQUEST:
            return {
                loading: true,
                items: state.items //keep existing state during request
            };
        case doctypeConstants.GETALL_SUCCESS:
            return {
                items: action.doctypes
            };
        case doctypeConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case doctypeConstants.UPDATE_REQUEST:
            // add 'updating:true' property to doctype being updated
            return {
                ...state,
                items: state.items.map(doctype =>
                    doctype.id === action.id
                        ? { ...doctype, updating: true }
                        : doctype
                )
            };
        case doctypeConstants.UPDATE_SUCCESS:
            // update doctype from state
            return {
                items: state.items.filter(doctype => doctype.id !== action.id)
            };
        case doctypeConstants.UPDATE_FAILURE:
            // remove 'updating:true' property and add 'updateError:[error]' property to doctype 
            return {
                ...state,
                items: state.items.map(doctype => {
                    if (doctype.id === action.id) {
                        // make copy of doctype without 'updating:true' property
                        const { updating, ...doctypeCopy } = doctype;
                        // return copy of doctype with 'updateError:[error]' property
                        return { ...doctypeCopy, updateError: action.error };
                    }

                    return doctype;
                })
            };
        case doctypeConstants.DELETE_REQUEST:
            // add 'deleting:true' property to doctype being deleted
            return {
                ...state,
                items: state.items.map(doctype =>
                    doctype.id === action.id
                        ? { ...doctype, deleting: true }
                        : doctype
                )
            };
        case doctypeConstants.DELETE_SUCCESS:
            // remove deleted doctype from state
            return {
                items: state.items.filter(doctype => doctype.id !== action.id)
            };
        case doctypeConstants.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to doctype 
            return {
                ...state,
                items: state.items.map(doctype => {
                    if (doctype.id === action.id) {
                        // make copy of doctype without 'deleting:true' property
                        const { deleting, ...doctypeCopy } = doctype;
                        // return copy of doctype with 'deleteError:[error]' property
                        return { ...doctypeCopy, deleteError: action.error };
                    }

                    return doctype;
                })
            };
        case doctypeConstants.CLEAR:
            return {};
        default:
            return state
    }
}