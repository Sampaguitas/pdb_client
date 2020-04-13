import { warehouseConstants } from '../_constants';

export function warehouses(state = {}, action) {
    switch (action.type) {
        case warehouseConstants.GETALL_REQUEST:
            return {
                loadingWarehouses: true,
                items: state.items
            };
        case warehouseConstants.GETALL_SUCCESS:
            return {
                items: action.warehouses
            };
        case warehouseConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case warehouseConstants.CLEAR:
            return {};
        default:
            return state
    }
}