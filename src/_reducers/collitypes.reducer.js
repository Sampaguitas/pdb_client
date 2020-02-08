import { collitypeConstants } from '../_constants';

export function collitypes(state = {}, action) {
    switch (action.type) {
        case collitypeConstants.CREATE_REQUEST:
            return {
                loadingCollipacks: true,
                items: action.collitypes
            };
        case collitypeConstants.CREATE_SUCCESS:
            return {
                items: action.collitypes
            };
        case collitypeConstants.CREATE_FAILURE:
            return {
                error: action.error
            };
        case collitypeConstants.GET_REQUEST:
            return {
                loadingCollipacks: true
            };
        case collitypeConstants.GET_SUCCESS:
            return {
                items: action.collitypes
            };
        case collitypeConstants.GET_FAILURE:
            return {
                error: action.error
            };
        case collitypeConstants.GETALL_REQUEST:
            return {
                loadingCollipacks: true,
                items: state.items //keep existing state during request
            };
        case collitypeConstants.GETALL_SUCCESS:
            return {
                items: action.collitypes
            };
        case collitypeConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case collitypeConstants.UPDATE_REQUEST:
            // add 'updating:true' property to collitype being updated
            return {
                ...state,
                items: state.items.map(collitype =>
                    collitype.id === action.id
                        ? { ...collitype, updating: true }
                        : collitype
                )
            };
        case collitypeConstants.UPDATE_SUCCESS:
            // update collitype from state
            return {
                items: state.items.filter(collitype => collitype.id !== action.id)
            };
        case collitypeConstants.UPDATE_FAILURE:
            // remove 'updating:true' property and add 'updateError:[error]' property to collitype 
            return {
                ...state,
                items: state.items.map(collitype => {
                    if (collitype.id === action.id) {
                        // make copy of collitype without 'updating:true' property
                        const { updating, ...collitypeCopy } = collitype;
                        // return copy of collitype with 'updateError:[error]' property
                        return { ...collitypeCopy, updateError: action.error };
                    }

                    return collitype;
                })
            };
        case collitypeConstants.DELETE_REQUEST:
            // add 'deleting:true' property to collitype being deleted
            return {
                ...state,
                items: state.items.map(collitype =>
                    collitype.id === action.id
                        ? { ...collitype, deleting: true }
                        : collitype
                )
            };
        case collitypeConstants.DELETE_SUCCESS:
            // remove deleted collitype from state
            return {
                items: state.items.filter(collitype => collitype.id !== action.id)
            };
        case collitypeConstants.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to collitype 
            return {
                ...state,
                items: state.items.map(collitype => {
                    if (collitype.id === action.id) {
                        // make copy of collitype without 'deleting:true' property
                        const { deleting, ...collitypeCopy } = collitype;
                        // return copy of collitype with 'deleteError:[error]' property
                        return { ...collitypeCopy, deleteError: action.error };
                    }

                    return collitype;
                })
            };
        case collitypeConstants.CLEAR:
            return {};
        default:
            return state
    }
}