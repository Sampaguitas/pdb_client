import { accessConstants } from '../_constants';
import { accessService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const accessActions = {
    create,
    getAll,
    getById,
    update,
    delete: _delete,
    clear
};

function create(access) {
    return dispatch => {
        dispatch(request(access));

        accessService.create(access)
            .then(
                access => {
                    dispatch(success(access)),
                    dispatch(accessService.getAll(access.projectId)),
                    dispatch(alertActions.success('Access successfully created'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(access) { return { type: accessConstants.CREATE_REQUEST, access } }
    function success(access) { return { type: accessConstants.CREATE_SUCCESS, access } }
    function failure(error) { return { type: accessConstants.CREATE_FAILURE, error } }
}


function getAll(projectId) {
    return dispatch => {
        dispatch(request(projectId));

        accessService.getAll(projectId)
            .then(
                accesses => dispatch(success(accesses)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(projectId) { return { type: accessConstants.GET_REQUEST, projectId } }
    function success(accesses) { return { type: accessConstants.GET_SUCCESS, accesses } }
    function failure(error) { return { type: accessConstants.GET_FAILURE, error } }
}

function getById(id) {
    return dispatch => {
        dispatch(request(id));

        accessService.getById(id)
            .then(
                access => dispatch(success(access)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(id) { return { type: accessConstants.GET_REQUEST, id } }
    function success(access) { return { type: accessConstants.GET_SUCCESS, access } }
    function failure(id, error) { return { type: accessConstants.GET_FAILURE, id, error } }
}

function update(access) {
    return dispatch => {
        dispatch(request(access));

        accessService.update(access)
            .then(
                access => {
                    dispatch(success(access)),
                    dispatch(alertActions.success('Access successfully updated'))
                },
                error => dispatch(failure(error.toString()))
            );
    };
    function request() { return { type: accessConstants.UPDATE_REQUEST } }
    function success(access) { return { type: accessConstants.UPDATE_SUCCESS, access } }
    function failure(error) { return { type: accessConstants.UPDATE_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        accessService.delete(id)
            .then(
                access => {
                    dispatch(success(id)),
                    dispatch(alertActions.success('Access successfully deleted')),
                    dispatch(accessService.getAll(access.projectId)) 
                },
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: accessConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: accessConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: accessConstants.DELETE_FAILURE, id, error } }
}

function clear() {
    return { type: accessConstants.CLEAR };
}