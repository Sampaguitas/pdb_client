import { mirConstants } from '../_constants';
import { mirService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const mirActions = {
    getAll,
    clear
};

function getAll(projectId) {
    return dispatch => {
        dispatch(request(projectId));

        mirService.getAll(projectId)
            .then(
                mirs => dispatch(success(mirs)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(projectId) { return { type: mirConstants.GETALL_REQUEST, projectId } }
    function success(mirs) { return { type: mirConstants.GETALL_SUCCESS, mirs } }
    function failure(error) { return { type: mirConstants.GETALL_FAILURE, error } }
}

function clear() {
    return { type: mirConstants.CLEAR };
}