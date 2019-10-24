import { docfieldConstants } from '../_constants';
import { docfieldService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const docfieldActions = {
    create,
    getAll,
    getById,
    update,
    delete: _delete,
    clear
};

function create(docfield) {
    return dispatch => {
        dispatch(request(docfield));

        docfieldService.create(docfield)
            .then(
                docfield => {
                    dispatch(success());
                    dispatch(alertActions.success('docfield successfully created'));
                    dispatch(docfieldActions.getAll(docfield.projectId));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(docfield) { return { type: docfieldConstants.CREATE_REQUEST, docfield } }
    function success(docfield) { return { type: docfieldConstants.CREATE_SUCCESS, docfield } }
    function failure(error) { return { type: docfieldConstants.CREATE_FAILURE, error } }
}

function getAll(projectId) {
    return dispatch => {
        dispatch(request(projectId));

        docfieldService.getAll(projectId)
            .then(
                docfields => dispatch(success(docfields)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(projectId) { return { type: docfieldConstants.GETALL_REQUEST, projectId } }
    function success(docfields) { return { type: docfieldConstants.GETALL_SUCCESS, docfields } }
    function failure(error) { return { type: docfieldConstants.GETALL_FAILURE, error } }
}

function getById(id) {
    return dispatch => {
        dispatch(request(id));

        docfieldService.getById(id)
            .then(
                docfield => dispatch(success(docfield)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: docfieldConstants.GET_REQUEST } }
    function success(docfield) { return { type: docfieldConstants.GET_SUCCESS, docfield } }
    function failure(id, error) { return { type: docfieldConstants.GET_FAILURE, id, error } }
}

function update(docfield) {
    return dispatch => {
        dispatch(request(docfield));

        docfieldService.update(docfield)
            .then(
                docfield => {
                    dispatch(success(docfield));
                    dispatch(alertActions.success('docfield successfully updated'));
                    dispatch(docfieldActions.getAll(docfield.projectId));
                },
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: docfieldConstants.UPDATE_REQUEST } }
    function success(docfield) { return { type: docfieldConstants.UPDATE_SUCCESS, docfield } }
    function failure(error) { return { type: docfieldConstants.UPDATE_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        docfieldService.delete(id)
            .then(
                docfield => {
                    dispatch(success(id));
                    dispatch(docfieldActions.getAll(docfield.projectId));
                },
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: docfieldConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: docfieldConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: docfieldConstants.DELETE_FAILURE, id, error } }
}

function clear() {
    return { type: docfieldConstants.CLEAR };
}