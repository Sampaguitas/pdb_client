import { poConstants } from '../_constants';
import { poService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const poActions = {
    create,
    getAll,
    getById,
    update,
    delete: _delete,
    clear
};

function create(po) {
    return dispatch => {
        dispatch(request(po));

        poService.create(po)
            .then(
                po => {
                    dispatch(success());
                    dispatch(alertActions.success('po successfully created'));
                    dispatch(poActions.getAll(po.projectId));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(po) { return { type: poConstants.CREATE_REQUEST, po } }
    function success(po) { return { type: poConstants.CREATE_SUCCESS, po } }
    function failure(error) { return { type: poConstants.CREATE_FAILURE, error } }
}

function getAll(projectId) {
    return dispatch => {
        dispatch(request(projectId));

        poService.getAll(projectId)
            .then(
                pos => dispatch(success(pos)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(projectId) { return { type: poConstants.GETALL_REQUEST, projectId } }
    function success(pos) { return { type: poConstants.GETALL_SUCCESS, pos } }
    function failure(error) { return { type: poConstants.GETALL_FAILURE, error } }
}

function getById(id) {
    return dispatch => {
        dispatch(request(id));

        poService.getById(id)
            .then(
                po => dispatch(success(po)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: poConstants.GET_REQUEST } }
    function success(po) { return { type: poConstants.GET_SUCCESS, po } }
    function failure(id, error) { return { type: poConstants.GET_FAILURE, id, error } }
}

function update(po) {
    return dispatch => {
        dispatch(request(po));

        poService.update(po)
            .then(
                po => {
                    dispatch(success(po));
                    dispatch(alertActions.success('po successfully updated'));
                    dispatch(poActions.getAll(po.projectId));
                },
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: poConstants.UPDATE_REQUEST } }
    function success(po) { return { type: poConstants.UPDATE_SUCCESS, po } }
    function failure(error) { return { type: poConstants.UPDATE_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        poService.delete(id)
            .then(
                po => {
                    dispatch(success(id));
                    dispatch(poActions.getAll(po.projectId));
                },
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: poConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: poConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: poConstants.DELETE_FAILURE, id, error } }
}

function clear() {
    return { type: poConstants.CLEAR };
}