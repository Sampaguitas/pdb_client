import { certificateConstants } from '../_constants';
import { certificateService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const certificateActions = {
    getAll,
    clear
};

function getAll(projectId) {
    return dispatch => {
        dispatch(request(projectId));

        certificateService.getAll(projectId)
            .then(
                certificates => dispatch(success(certificates)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(projectId) { return { type: certificateConstants.GETALL_REQUEST, projectId } }
    function success(certificates) { return { type: certificateConstants.GETALL_SUCCESS, certificates } }
    function failure(error) { return { type: certificateConstants.GETALL_FAILURE, error } }
}

function clear() {
    return { type: certificateConstants.CLEAR };
}