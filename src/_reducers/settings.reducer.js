import { settingConstants } from '../_constants';

export function settings(state = {}, action) {
    switch (action.type) {
        case settingConstants.GETALL_REQUEST:
            return {
                loadingSettings: true,
                items: state.items
            };
        case settingConstants.GETALL_SUCCESS:
            return {
                items: action.settings
            };
        case settingConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case settingConstants.CLEAR:
            return {};
        default:
            return state
    }
}