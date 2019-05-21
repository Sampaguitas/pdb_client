import { localeConstants } from '../_constants';

export function locales(state = {}, action) {
    switch (action.type) {
        case localeConstants.CREATE_REQUEST:
            return {
                loading: true,
                items: action.locales
            };
        case localeConstants.CREATE_SUCCESS:
            return {
                items: action.locales
            };
        case localeConstants.CREATE_FAILURE:
            return {
                error: action.error
            };
        case localeConstants.GET_REQUEST:
            return {
                loading: true
            };
        case localeConstants.GET_SUCCESS:
            return {
                items: action.locales
            };
        case localeConstants.GET_FAILURE:
            return {
                error: action.error
            };
        case localeConstants.GETALL_REQUEST:
            return {
                loading: true
            };
        case localeConstants.GETALL_SUCCESS:
            return {
                items: action.locales
            };
        case localeConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case localeConstants.UPDATE_REQUEST:
            // add 'updating:true' property to locale being updated
            return {
                ...state,
                items: state.items.map(locale =>
                    locale.id === action.id
                        ? { ...locale, updating: true }
                        : locale
                )
            };
        case localeConstants.UPDATE_SUCCESS:
            // update locale from state
            return {
                items: state.items.filter(locale => locale.id !== action.id)
            };
        case localeConstants.UPDATE_FAILURE:
            // remove 'updating:true' property and add 'updateError:[error]' property to locale 
            return {
                ...state,
                items: state.items.map(locale => {
                    if (locale.id === action.id) {
                        // make copy of locale without 'updating:true' property
                        const { updating, ...localeCopy } = locale;
                        // return copy of locale with 'updateError:[error]' property
                        return { ...localeCopy, updateError: action.error };
                    }

                    return locale;
                })
            };
        case localeConstants.DELETE_REQUEST:
            // add 'deleting:true' property to locale being deleted
            return {
                ...state,
                items: state.items.map(locale =>
                    locale.id === action.id
                        ? { ...locale, deleting: true }
                        : locale
                )
            };
        case localeConstants.DELETE_SUCCESS:
            // remove deleted locale from state
            return {
                items: state.items.filter(locale => locale.id !== action.id)
            };
        case localeConstants.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to locale 
            return {
                ...state,
                items: state.items.map(locale => {
                    if (locale.id === action.id) {
                        // make copy of locale without 'deleting:true' property
                        const { deleting, ...localeCopy } = locale;
                        // return copy of locale with 'deleteError:[error]' property
                        return { ...localeCopy, deleteError: action.error };
                    }

                    return locale;
                })
            };
        default:
            return state
    }
}