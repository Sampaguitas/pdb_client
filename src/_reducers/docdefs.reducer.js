import { docdefConstants } from '../_constants';

export function docdefs(state = {}, action) {
    switch (action.type) {
        case docdefConstants.CREATE_REQUEST:
            return {
                creatingDocdef: true,
                items: action.docdefs
            };
        case docdefConstants.CREATE_SUCCESS:
            return {
                items: action.docdefs
            };
        case docdefConstants.CREATE_FAILURE:
            return {
                error: action.error
            };
        case docdefConstants.GET_REQUEST:
            return {
                loadingDocdef: true
            };
        case docdefConstants.GET_SUCCESS:
            return {
                items: action.docdefs
            };
        case docdefConstants.GET_FAILURE:
            return {
                error: action.error
            };
        case docdefConstants.GETALL_REQUEST:
            return {
                loadingDocdefs: true,
                items: state.items //keep existing state during request
            };
        case docdefConstants.GETALL_SUCCESS:
            return {
                items: action.docdefs
            };
        case docdefConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case docdefConstants.UPDATE_REQUEST:
            // add 'updating:true' property to docdef being updated
            return {
                ...state,
                items: state.items.map(docdef =>
                    docdef.id === action.id
                        ? { ...docdef, updating: true }
                        : docdef
                )
            };
        case docdefConstants.UPDATE_SUCCESS:
            // update docdef from state
            return {
                items: state.items.filter(docdef => docdef.id !== action.id)
            };
        case docdefConstants.UPDATE_FAILURE:
            // remove 'updating:true' property and add 'updateError:[error]' property to docdef 
            return {
                ...state,
                items: state.items.map(docdef => {
                    if (docdef.id === action.id) {
                        // make copy of docdef without 'updating:true' property
                        const { updating, ...docdefCopy } = docdef;
                        // return copy of docdef with 'updateError:[error]' property
                        return { ...docdefCopy, updateError: action.error };
                    }

                    return docdef;
                })
            };
        case docdefConstants.DELETE_REQUEST:
            // add 'deleting:true' property to docdef being deleted
            return {
                ...state,
                items: state.items.map(docdef =>
                    docdef.id === action.id
                        ? { ...docdef, deleting: true }
                        : docdef
                )
            };
        case docdefConstants.DELETE_SUCCESS:
            // remove deleted docdef from state
            return {
                items: state.items.filter(docdef => docdef.id !== action.id)
            };
        case docdefConstants.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to docdef 
            return {
                ...state,
                items: state.items.map(docdef => {
                    if (docdef.id === action.id) {
                        // make copy of docdef without 'deleting:true' property
                        const { deleting, ...docdefCopy } = docdef;
                        // return copy of docdef with 'deleteError:[error]' property
                        return { ...docdefCopy, deleteError: action.error };
                    }

                    return docdef;
                })
            };
        case docdefConstants.CLEAR:
            return {};
        default:
            return state
    }
}