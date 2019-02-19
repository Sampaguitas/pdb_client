import { incotermConstants } from '../_constants';

export function currencies(state = {}, action) {
    switch (action.type) {
        case incotermConstants.CREATE_REQUEST:
            return {
                loading: true,
                items: action.currencies
            };
        case incotermConstants.CREATE_SUCCESS:
            return {
                items: action.currencies
            };
        case incotermConstants.CREATE_FAILURE:
            return {
                error: action.error
            };
        case incotermConstants.GET_REQUEST:
            return {
                loading: true
            };
        case incotermConstants.GET_SUCCESS:
            return {
                items: action.currencies
            };
        case incotermConstants.GET_FAILURE:
            return {
                error: action.error
            };
        case incotermConstants.GETALL_REQUEST:
            return {
                loading: true
            };
        case incotermConstants.GETALL_SUCCESS:
            return {
                items: action.currencies
            };
        case incotermConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case incotermConstants.UPDATE_REQUEST:
            // add 'updating:true' property to incoterm being updated
            return {
                ...state,
                items: state.items.map(incoterm =>
                    incoterm.id === action.id
                        ? { ...incoterm, updating: true }
                        : incoterm
                )
            };
        case incotermConstants.UPDATE_SUCCESS:
            // update incoterm from state
            return {
                items: state.items.filter(incoterm => incoterm.id !== action.id)
            };
        case incotermConstants.UPDATE_FAILURE:
            // remove 'updating:true' property and add 'updateError:[error]' property to incoterm 
            return {
                ...state,
                items: state.items.map(incoterm => {
                    if (incoterm.id === action.id) {
                        // make copy of incoterm without 'updating:true' property
                        const { updating, ...incotermCopy } = incoterm;
                        // return copy of incoterm with 'updateError:[error]' property
                        return { ...incotermCopy, updateError: action.error };
                    }

                    return incoterm;
                })
            };
        case incotermConstants.DELETE_REQUEST:
            // add 'deleting:true' property to incoterm being deleted
            return {
                ...state,
                items: state.items.map(incoterm =>
                    incoterm.id === action.id
                        ? { ...incoterm, deleting: true }
                        : incoterm
                )
            };
        case incotermConstants.DELETE_SUCCESS:
            // remove deleted incoterm from state
            return {
                items: state.items.filter(incoterm => incoterm.id !== action.id)
            };
        case incotermConstants.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to incoterm 
            return {
                ...state,
                items: state.items.map(incoterm => {
                    if (incoterm.id === action.id) {
                        // make copy of incoterm without 'deleting:true' property
                        const { deleting, ...incotermCopy } = incoterm;
                        // return copy of incoterm with 'deleteError:[error]' property
                        return { ...incotermCopy, deleteError: action.error };
                    }

                    return incoterm;
                })
            };
        default:
            return state
    }
}