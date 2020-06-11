import { heatpickConstants } from '../_constants';
import { heatpickService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const heatpickActions = {
    getAll,
    clear
};

function getAll(projectId) {
    return dispatch => {
        dispatch(request(projectId));

        heatpickService.getAll(projectId)
            .then(
                heatpicks => dispatch(success(heatpicks)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(projectId) { return { type: heatpickConstants.GETALL_REQUEST, projectId } }
    function success(heatpicks) { return { type: heatpickConstants.GETALL_SUCCESS, heatpicks } }
    function failure(error) { return { type: heatpickConstants.GETALL_FAILURE, error } }
}

function clear() {
    return { type: heatpickConstants.CLEAR };
}