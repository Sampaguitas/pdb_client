import { screenConstants } from '../_constants';

export function screens(state = {}, action) {
    switch (action.type) {
        case screenConstants.CREATE_REQUEST:
            return {
                loading: true,
                items: action.screens
            };
        case screenConstants.CREATE_SUCCESS:
            return {
                items: action.screens
            };
        case screenConstants.CREATE_FAILURE:
            return {
                error: action.error
            };
        case screenConstants.GET_REQUEST:
            return {
                loading: true
            };
        case screenConstants.GET_SUCCESS:
            return {
                items: action.screens
            };
        case screenConstants.GET_FAILURE:
            return {
                error: action.error
            };
        case screenConstants.GETALL_REQUEST:
            return {
                loading: true
            };
        case screenConstants.GETALL_SUCCESS:
            return {
                items: action.screens
            };
        case screenConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case screenConstants.UPDATE_REQUEST:
            // add 'updating:true' property to screen being updated
            return {
                ...state,
                items: state.items.map(screen =>
                    screen.id === action.id
                        ? { ...screen, updating: true }
                        : screen
                )
            };
        case screenConstants.UPDATE_SUCCESS:
            // update screen from state
            return {
                items: state.items.filter(screen => screen.id !== action.id)
            };
        case screenConstants.UPDATE_FAILURE:
            // remove 'updating:true' property and add 'updateError:[error]' property to screen 
            return {
                ...state,
                items: state.items.map(screen => {
                    if (screen.id === action.id) {
                        // make copy of screen without 'updating:true' property
                        const { updating, ...screenCopy } = screen;
                        // return copy of screen with 'updateError:[error]' property
                        return { ...screenCopy, updateError: action.error };
                    }

                    return screen;
                })
            };
        case screenConstants.DELETE_REQUEST:
            // add 'deleting:true' property to screen being deleted
            return {
                ...state,
                items: state.items.map(screen =>
                    screen.id === action.id
                        ? { ...screen, deleting: true }
                        : screen
                )
            };
        case screenConstants.DELETE_SUCCESS:
            // remove deleted screen from state
            return {
                items: state.items.filter(screen => screen.id !== action.id)
            };
        case screenConstants.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to screen 
            return {
                ...state,
                items: state.items.map(screen => {
                    if (screen.id === action.id) {
                        // make copy of screen without 'deleting:true' property
                        const { deleting, ...screenCopy } = screen;
                        // return copy of screen with 'deleteError:[error]' property
                        return { ...screenCopy, deleteError: action.error };
                    }

                    return screen;
                })
            };
        default:
            return state
    }
}