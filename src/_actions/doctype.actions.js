import { doctypeConstants } from '../_constants';
import { doctypeService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const doctypeActions = {
    create,
    getAll,
    getById,
    update,
    delete: _delete,
    clear
};

function create(doctype) {
    return dispatch => {
        dispatch(request(doctype));

        doctypeService.create(doctype)
            .then(
                doctype => {
                    dispatch(success());
                    dispatch(doctypeService.getAll());
                    dispatch(alertActions.success('doctype successfully created'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(doctype) { return { type: doctypeConstants.CREATE_REQUEST, doctype } }
    function success(doctype) { return { type: doctypeConstants.CREATE_SUCCESS, doctype } }
    function failure(error) { return { type: doctypeConstants.CREATE_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        doctypeService.getAll()
            .then(
                doctypes => dispatch(success(doctypes)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: doctypeConstants.GETALL_REQUEST } }
    function success(doctypes) { return { type: doctypeConstants.GETALL_SUCCESS, doctypes } }
    function failure(error) { return { type: doctypeConstants.GETALL_FAILURE, error } }
}

function getById(id) {
    return dispatch => {
        dispatch(request(id));

        doctypeService.getById(id)
            .then(
                doctype => dispatch(success(doctype)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(id) { return { type: doctypeConstants.GET_REQUEST, id } }
    function success(doctype) { return { type: doctypeConstants.GET_SUCCESS, doctype } }
    function failure(id, error) { return { type: doctypeConstants.GET_FAILURE, id, error } }
}

function update(doctype) {
    return dispatch => {
        dispatch(request(doctype));

        doctypeService.update(doctype)
            .then(
                doctype => {
                    dispatch(success(doctype));
                    dispatch(doctypeService.getAll());
                    dispatch(alertActions.success('doctype successfully updated'));
                },
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: doctypeConstants.UPDATE_REQUEST } }
    function success(doctype) { return { type: doctypeConstants.UPDATE_SUCCESS, doctype } }
    function failure(error) { return { type: doctypeConstants.UPDATE_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        doctypeService.delete(id)
            .then(
                doctype => {
                    dispatch(success(id));
                    dispatch(doctypeService.getAll());
                },
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: doctypeConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: doctypeConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: doctypeConstants.DELETE_FAILURE, id, error } }
}

function clear() {
    return { type: doctypeConstants.CLEAR };
}