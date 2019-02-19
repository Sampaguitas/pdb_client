import { incotermConstants } from '../_constants';
import { incotermService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const incotermActions = {
    create,
    getAll,
    getById,
    update,
    delete: _delete
};

function create(incoterm) {
    return dispatch => {
        dispatch(request(incoterm));

        incotermService.create(incoterm)
            .then(
                incoterm => {
                    dispatch(success());
                    history.push('/');
                    dispatch(alertActions.success('successfully Created'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(incoterm) { return { type: incotermConstants.CREATE_REQUEST, incoterm } }
    function success(incoterm) { return { type: incotermConstants.CREATE_SUCCESS, incoterm } }
    function failure(error) { return { type: incotermConstants.CREATE_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        incotermService.getAll()
            .then(
                currencies => dispatch(success(currencies)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: incotermConstants.GETALL_REQUEST } }
    function success(currencies) { return { type: incotermConstants.GETALL_SUCCESS, currencies } }
    function failure(error) { return { type: incotermConstants.GETALL_FAILURE, error } }
}

function getById(id) {
    return dispatch => {
        dispatch(request(id));

        incotermService.getById(id)
            .then(
                incoterm => dispatch(success(incoterm)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: incotermConstants.GET_REQUEST } }
    function success(incoterm) { return { type: incotermConstants.GET_SUCCESS, incoterm } }
    function failure(id, error) { return { type: incotermConstants.GET_FAILURE, id, error } }
}

function update(incoterm) {
    return dispatch => {
        dispatch(request(incoterm));

        incotermService.update(incoterm)
            .then(
                incoterm => dispatch(success(incoterm)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: incotermConstants.GET_REQUEST } }
    function success(incoterm) { return { type: incotermConstants.GET_SUCCESS, incoterm } }
    function failure(error) { return { type: incotermConstants.GET_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        incotermService.delete(id)
            .then(
                incoterm => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: incotermConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: incotermConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: incotermConstants.DELETE_FAILURE, id, error } }
}