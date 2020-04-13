import { warehouseConstants } from '../_constants';
import { warehouseService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const warehouseActions = {
    getAll,
    clear
};

function getAll(projectId) {
    return dispatch => {
        dispatch(request(projectId));

        warehouseService.getAll(projectId)
            .then(
                warehouses => dispatch(success(warehouses)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(projectId) { return { type: warehouseConstants.GETALL_REQUEST, projectId } }
    function success(warehouses) { return { type: warehouseConstants.GETALL_SUCCESS, warehouses } }
    function failure(error) { return { type: warehouseConstants.GETALL_FAILURE, error } }
}

function clear() {
    return { type: warehouseConstants.CLEAR };
}