import { heatlocConstants } from '../_constants';
import { heatlocService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const heatlocActions = {
    getAll,
    clear
};

function getAll(projectId) {
    return dispatch => {
        dispatch(request(projectId));

        heatlocService.getAll(projectId)
            .then(
                heatlocs => dispatch(success(heatlocs)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(projectId) { return { type: heatlocConstants.GETALL_REQUEST, projectId } }
    function success(heatlocs) { return { type: heatlocConstants.GETALL_SUCCESS, heatlocs } }
    function failure(error) { return { type: heatlocConstants.GETALL_FAILURE, error } }
}

function clear() {
    return { type: heatlocConstants.CLEAR };
}