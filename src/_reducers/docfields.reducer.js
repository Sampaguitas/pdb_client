import { docfieldConstants } from '../_constants';

export function docfields(state = {}, action) {
    switch (action.type) {
        case docfieldConstants.CREATE_REQUEST:
            return {
                creatingDocfield: true,
                items: action.docfields
            };
        case docfieldConstants.CREATE_SUCCESS:
            return {
                items: action.docfields
            };
        case docfieldConstants.CREATE_FAILURE:
            return {
                error: action.error
            };
        case docfieldConstants.GET_REQUEST:
            return {
                loadingDocfield: true
            };
        case docfieldConstants.GET_SUCCESS:
            return {
                items: action.docfields
            };
        case docfieldConstants.GET_FAILURE:
            return {
                error: action.error
            };
        case docfieldConstants.GETALL_REQUEST:
            return {
                loadingDocfields: true,
                items: state.items //keep existing state during request
            };
        case docfieldConstants.GETALL_SUCCESS:
            return {
                items: action.docfields
            };
        case docfieldConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case docfieldConstants.UPDATE_REQUEST:
            // add 'updating:true' property to docfield being updated
            return {
                ...state,
                items: state.items.map(docfield =>
                    docfield.id === action.id
                        ? { ...docfield, updating: true }
                        : docfield
                )
            };
        case docfieldConstants.UPDATE_SUCCESS:
            // update docfield from state
            return {
                items: state.items.filter(docfield => docfield.id !== action.id)
            };
        case docfieldConstants.UPDATE_FAILURE:
            // remove 'updating:true' property and add 'updateError:[error]' property to docfield 
            return {
                ...state,
                items: state.items.map(docfield => {
                    if (docfield.id === action.id) {
                        // make copy of docfield without 'updating:true' property
                        const { updating, ...docfieldCopy } = docfield;
                        // return copy of docfield with 'updateError:[error]' property
                        return { ...docfieldCopy, updateError: action.error };
                    }

                    return docfield;
                })
            };
        case docfieldConstants.DELETE_REQUEST:
            // add 'deleting:true' property to docfield being deleted
            return {
                ...state,
                items: state.items.map(docfield =>
                    docfield.id === action.id
                        ? { ...docfield, deleting: true }
                        : docfield
                )
            };
        case docfieldConstants.DELETE_SUCCESS:
            // remove deleted docfield from state
            return {
                items: state.items.filter(docfield => docfield.id !== action.id)
            };
        case docfieldConstants.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to docfield 
            return {
                ...state,
                items: state.items.map(docfield => {
                    if (docfield.id === action.id) {
                        // make copy of docfield without 'deleting:true' property
                        const { deleting, ...docfieldCopy } = docfield;
                        // return copy of docfield with 'deleteError:[error]' property
                        return { ...docfieldCopy, deleteError: action.error };
                    }

                    return docfield;
                })
            };
        case docfieldConstants.CLEAR:
            return {};
        default:
            return state
    }
}