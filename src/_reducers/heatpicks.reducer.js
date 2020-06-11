import { heatpickConstants } from '../_constants';

export function heatpicks(state = {}, action) {
    switch (action.type) {
        case heatpickConstants.GETALL_REQUEST:
            return {
                loadingHeatpicks: true,
                items: state.items
            };
        case heatpickConstants.GETALL_SUCCESS:
            return {
                items: action.heatpicks
            };
        case heatpickConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case heatpickConstants.CLEAR:
            return {};
        default:
            return state
    }
}