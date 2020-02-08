import { collipackConstants } from '../_constants';
import { collipackService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const collipackActions = {
    create,
    getAll,
    getById,
    update,
    delete: _delete,
    clear
};

function create(collipack) {
    return dispatch => {
        dispatch(request(collipack));

        collipackService.create(collipack)
            .then(
                collipack => {
                    dispatch(success());
                    dispatch(alertActions.success('collipack successfully created'));
                    dispatch(collipackActions.getAll(collipack.projectId));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(collipack) { return { type: collipackConstants.CREATE_REQUEST, collipack } }
    function success(collipack) { return { type: collipackConstants.CREATE_SUCCESS, collipack } }
    function failure(error) { return { type: collipackConstants.CREATE_FAILURE, error } }
}

function getAll(projectId) {
    return dispatch => {
        dispatch(request(projectId));

        collipackService.getAll(projectId)
            .then(
                collipacks => dispatch(success(collipacks)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(projectId) { return { type: collipackConstants.GETALL_REQUEST, projectId } }
    function success(collipacks) { return { type: collipackConstants.GETALL_SUCCESS, collipacks } }
    function failure(error) { return { type: collipackConstants.GETALL_FAILURE, error } }
}

function getById(id) {
    return dispatch => {
        dispatch(request(id));

        collipackService.getById(id)
            .then(
                collipack => dispatch(success(collipack)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: collipackConstants.GET_REQUEST } }
    function success(collipack) { return { type: collipackConstants.GET_SUCCESS, collipack } }
    function failure(id, error) { return { type: collipackConstants.GET_FAILURE, id, error } }
}

function update(collipack) {
    return dispatch => {
        dispatch(request(collipack));

        collipackService.update(collipack)
            .then(
                collipack => {
                    dispatch(success(collipack));
                    dispatch(alertActions.success('collipack successfully updated'));
                    dispatch(collipackActions.getAll(collipack.projectId));
                },
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: collipackConstants.UPDATE_REQUEST } }
    function success(collipack) { return { type: collipackConstants.UPDATE_SUCCESS, collipack } }
    function failure(error) { return { type: collipackConstants.UPDATE_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        collipackService.delete(id)
            .then(
                collipack => {
                    dispatch(success(id));
                    dispatch(collipackActions.getAll(collipack.projectId));
                },
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: collipackConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: collipackConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: collipackConstants.DELETE_FAILURE, id, error } }
}

function clear() {
    return { type: collipackConstants.CLEAR };
}