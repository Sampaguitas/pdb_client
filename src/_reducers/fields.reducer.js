import { fieldConstants } from '../_constants';

export function fields(state = {}, action) {
    switch (action.type) {
        case fieldConstants.CREATE_REQUEST:
            return {
                creatingFields: true,
                items: action.fields
            };
        case fieldConstants.CREATE_SUCCESS:
            return {
                items: action.fields
            };
        case fieldConstants.CREATE_FAILURE:
            return {
                error: action.error
            };
        case fieldConstants.GET_REQUEST:
            return {
                loadingField: true
            };
        case fieldConstants.GET_SUCCESS:
            return {
                items: action.fields
            };
        case fieldConstants.GET_FAILURE:
            return {
                error: action.error
            };
        case fieldConstants.GETALL_REQUEST:
            return {
                loadingFields: true,
                items: state.items //keep existing state during request
            };
        case fieldConstants.GETALL_SUCCESS:
            return {
                items: action.fields
            };
        case fieldConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case fieldConstants.UPDATE_REQUEST:
            // add 'updating:true' property to field being updated
            return {
                ...state,
                items: state.items.map(field =>
                    field.id === action.id
                        ? { ...field, updating: true }
                        : field
                )
            };
        case fieldConstants.UPDATE_SUCCESS:
            // update field from state
            return {
                items: state.items.filter(field => field.id !== action.id)
            };
        case fieldConstants.UPDATE_FAILURE:
            // remove 'updating:true' property and add 'updateError:[error]' property to field 
            return {
                ...state,
                items: state.items.map(field => {
                    if (field.id === action.id) {
                        // make copy of field without 'updating:true' property
                        const { updating, ...fieldCopy } = field;
                        // return copy of field with 'updateError:[error]' property
                        return { ...fieldCopy, updateError: action.error };
                    }

                    return field;
                })
            };
        case fieldConstants.DELETE_REQUEST:
            // add 'deleting:true' property to field being deleted
            return {
                ...state,
                items: state.items.map(field =>
                    field.id === action.id
                        ? { ...field, deleting: true }
                        : field
                )
            };
        case fieldConstants.DELETE_SUCCESS:
            // remove deleted field from state
            return {
                items: state.items.filter(field => field.id !== action.id)
            };
        case fieldConstants.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to field 
            return {
                ...state,
                items: state.items.map(field => {
                    if (field.id === action.id) {
                        // make copy of field without 'deleting:true' property
                        const { deleting, ...fieldCopy } = field;
                        // return copy of field with 'deleteError:[error]' property
                        return { ...fieldCopy, deleteError: action.error };
                    }

                    return field;
                })
            };
        case fieldConstants.CLEAR:
            return {};
        default:
            return state
    }
}