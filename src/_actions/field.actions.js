import { fieldConstants } from '../_constants';
import { fieldService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const fieldActions = {
    create,
    getAll,
    getById,
    update,
    delete: _delete,
    clear
};

function create(field) {
    return dispatch => {
        dispatch(request(field));

        fieldService.create(field)
            .then(
                field => {
                    dispatch(success());
                    dispatch(fieldService.getAll(field.projectId));
                    dispatch(alertActions.success('field successfully created'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(field) { return { type: fieldConstants.CREATE_REQUEST, field } }
    function success(field) { return { type: fieldConstants.CREATE_SUCCESS, field } }
    function failure(error) { return { type: fieldConstants.CREATE_FAILURE, error } }
}

function getAll(projectId) {
    return dispatch => {
        dispatch(request(projectId));

        fieldService.getAll(projectId)
            .then(
                fields => dispatch(success(fields)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(projectId) { return { type: fieldConstants.GETALL_REQUEST, projectId } }
    function success(fields) { return { type: fieldConstants.GETALL_SUCCESS, fields } }
    function failure(error) { return { type: fieldConstants.GETALL_FAILURE, error } }
}

function getById(id) {
    return dispatch => {
        dispatch(request(id));

        fieldService.getById(id)
            .then(
                field => dispatch(success(field)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(id) { return { type: fieldConstants.GET_REQUEST, id } }
    function success(field) { return { type: fieldConstants.GET_SUCCESS, field } }
    function failure(id, error) { return { type: fieldConstants.GET_FAILURE, id, error } }
}

function update(field) {
    return dispatch => {
        dispatch(request(field));

        fieldService.update(field)
            .then(
                field => {
                    dispatch(success(field));
                    dispatch(alertActions.success('field successfully updated'));
                    dispatch(fieldActions.getAll(field.projectId));
                },
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: fieldConstants.UPDATE_REQUEST } }
    function success(field) { return { type: fieldConstants.UPDATE_SUCCESS, field } }
    function failure(error) { return { type: fieldConstants.UPDATE_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        fieldService.delete(id)
            .then(
                field => {
                    dispatch(success(id));
                    dispatch(fieldActions.success('Access successfully deleted'));
                    dispatch(fieldActions.getAll(field.projectId));
                },
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: fieldConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: fieldConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: fieldConstants.DELETE_FAILURE, id, error } }
}

function clear() {
    return { type: fieldConstants.CLEAR };
}