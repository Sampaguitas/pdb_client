import { fieldnameConstants } from '../_constants';
import { fieldnameService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const fieldnameActions = {
    create,
    getAll,
    getById,
    update,
    delete: _delete
};

function create(fieldname) {
    return dispatch => {
        dispatch(request(fieldname));

        fieldnameService.create(fieldname)
            .then(
                fieldname => {
                    dispatch(success());
                    // history.push('/');
                    dispatch(alertActions.success('fieldname successfully created'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(fieldname) { return { type: fieldnameConstants.CREATE_REQUEST, fieldname } }
    function success(fieldname) { return { type: fieldnameConstants.CREATE_SUCCESS, fieldname } }
    function failure(error) { return { type: fieldnameConstants.CREATE_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        fieldnameService.getAll()
            .then(
                fieldnames => dispatch(success(fieldnames)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: fieldnameConstants.GETALL_REQUEST } }
    function success(fieldnames) { return { type: fieldnameConstants.GETALL_SUCCESS, fieldnames } }
    function failure(error) { return { type: fieldnameConstants.GETALL_FAILURE, error } }
}

function getById(id) {
    return dispatch => {
        dispatch(request(id));

        fieldnameService.getById(id)
            .then(
                fieldname => dispatch(success(fieldname)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: fieldnameConstants.GET_REQUEST } }
    function success(fieldname) { return { type: fieldnameConstants.GET_SUCCESS, fieldname } }
    function failure(id, error) { return { type: fieldnameConstants.GET_FAILURE, id, error } }
}

function update(fieldname) {
    return dispatch => {
        dispatch(request(fieldname));

        fieldnameService.update(fieldname)
            .then(
                fieldname => {
                    dispatch(success(fieldname)),
                    dispatch(alertActions.success('fieldname successfully updated'))
                },
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: fieldnameConstants.UPDATE_REQUEST } }
    function success(fieldname) { return { type: fieldnameConstants.UPDATE_SUCCESS, fieldname } }
    function failure(error) { return { type: fieldnameConstants.UPDATE_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        fieldnameService.delete(id)
            .then(
                fieldname => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: fieldnameConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: fieldnameConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: fieldnameConstants.DELETE_FAILURE, id, error } }
}