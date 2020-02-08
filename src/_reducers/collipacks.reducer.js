import { collipackConstants } from '../_constants';

export function collipacks(state = {}, action) {
    switch (action.type) {
        case collipackConstants.CREATE_REQUEST:
            return {
                creatingcollipack: true,
                items: action.collipacks
            };
        case collipackConstants.CREATE_SUCCESS:
            return {
                items: action.collipacks
            };
        case collipackConstants.CREATE_FAILURE:
            return {
                error: action.error
            };
        case collipackConstants.GET_REQUEST:
            return {
                loadingcollipack: true
            };
        case collipackConstants.GET_SUCCESS:
            return {
                items: action.collipacks
            };
        case collipackConstants.GET_FAILURE:
            return {
                error: action.error
            };
        case collipackConstants.GETALL_REQUEST:
            return {
                loadingcollipacks: true,
                items: state.items //keep existing state during request
            };
        case collipackConstants.GETALL_SUCCESS:
            return {
                items: action.collipacks
            };
        case collipackConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case collipackConstants.UPDATE_REQUEST:
            // add 'updating:true' property to collipack being updated
            return {
                ...state,
                items: state.items.map(collipack =>
                    collipack.id === action.id
                        ? { ...collipack, updating: true }
                        : collipack
                )
            };
        case collipackConstants.UPDATE_SUCCESS:
            // update collipack from state
            return {
                items: state.items.filter(collipack => collipack.id !== action.id)
            };
        case collipackConstants.UPDATE_FAILURE:
            // remove 'updating:true' property and add 'updateError:[error]' property to collipack 
            return {
                ...state,
                items: state.items.map(collipack => {
                    if (collipack.id === action.id) {
                        // make copy of collipack without 'updating:true' property
                        const { updating, ...collipackCopy } = collipack;
                        // return copy of collipack with 'updateError:[error]' property
                        return { ...collipackCopy, updateError: action.error };
                    }

                    return collipack;
                })
            };
        case collipackConstants.DELETE_REQUEST:
            // add 'deleting:true' property to collipack being deleted
            return {
                ...state,
                items: state.items.map(collipack =>
                    collipack.id === action.id
                        ? { ...collipack, deleting: true }
                        : collipack
                )
            };
        case collipackConstants.DELETE_SUCCESS:
            // remove deleted collipack from state
            return {
                items: state.items.filter(collipack => collipack.id !== action.id)
            };
        case collipackConstants.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to collipack 
            return {
                ...state,
                items: state.items.map(collipack => {
                    if (collipack.id === action.id) {
                        // make copy of collipack without 'deleting:true' property
                        const { deleting, ...collipackCopy } = collipack;
                        // return copy of collipack with 'deleteError:[error]' property
                        return { ...collipackCopy, deleteError: action.error };
                    }

                    return collipack;
                })
            };
        case collipackConstants.CLEAR:
            return {};
        default:
            return state
    }
}