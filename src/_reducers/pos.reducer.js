import { poConstants } from '../_constants';

export function pos(state = {}, action) {
    switch (action.type) {
        case poConstants.CREATE_REQUEST:
            return {
                creatingPo: true,
                items: action.pos
            };
        case poConstants.CREATE_SUCCESS:
            return {
                items: action.pos
            };
        case poConstants.CREATE_FAILURE:
            return {
                error: action.error
            };
        case poConstants.GET_REQUEST:
            return {
                loadingPo: true
            };
        case poConstants.GET_SUCCESS:
            return {
                items: action.pos
            };
        case poConstants.GET_FAILURE:
            return {
                error: action.error
            };
        case poConstants.GETALL_REQUEST:
            return {
                loadingPos: true,
                items: state.items //keep existing state during request
            };
        case poConstants.GETALL_SUCCESS:
            return {
                items: action.pos
            };
        case poConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case poConstants.UPDATE_REQUEST:
            // add 'updating:true' property to po being updated
            return {
                ...state,
                items: state.items.map(po =>
                    po.id === action.id
                        ? { ...po, updating: true }
                        : po
                )
            };
        case poConstants.UPDATE_SUCCESS:
            // update po from state
            return {
                items: state.items.filter(po => po.id !== action.id)
            };
        case poConstants.UPDATE_FAILURE:
            // remove 'updating:true' property and add 'updateError:[error]' property to po 
            return {
                ...state,
                items: state.items.map(po => {
                    if (po.id === action.id) {
                        // make copy of po without 'updating:true' property
                        const { updating, ...poCopy } = po;
                        // return copy of po with 'updateError:[error]' property
                        return { ...poCopy, updateError: action.error };
                    }

                    return po;
                })
            };
        case poConstants.DELETE_REQUEST:
            // add 'deleting:true' property to po being deleted
            return {
                ...state,
                items: state.items.map(po =>
                    po.id === action.id
                        ? { ...po, deleting: true }
                        : po
                )
            };
        case poConstants.DELETE_SUCCESS:
            // remove deleted po from state
            return {
                items: state.items.filter(po => po.id !== action.id)
            };
        case poConstants.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to po 
            return {
                ...state,
                items: state.items.map(po => {
                    if (po.id === action.id) {
                        // make copy of po without 'deleting:true' property
                        const { deleting, ...poCopy } = po;
                        // return copy of po with 'deleteError:[error]' property
                        return { ...poCopy, deleteError: action.error };
                    }

                    return po;
                })
            };
        case poConstants.CLEAR:
            return {};
        default:
            return state
    }
}