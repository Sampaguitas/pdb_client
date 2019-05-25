import { regionConstants } from '../_constants';
import { regionService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const regionActions = {
    create,
    getAll,
    getById,
    update,
    delete: _delete
};

function create(region) {
    return dispatch => {
        dispatch(request(region));

        regionService.create(region)
            .then(
                region => {
                    dispatch(success());
                    // history.push('/');
                    dispatch(alertActions.success('successfully Created'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(region) { return { type: regionConstants.CREATE_REQUEST, region } }
    function success(region) { return { type: regionConstants.CREATE_SUCCESS, region } }
    function failure(error) { return { type: regionConstants.CREATE_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        regionService.getAll()
            .then(
                regions => dispatch(success(regions)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: regionConstants.GETALL_REQUEST } }
    function success(regions) { return { type: regionConstants.GETALL_SUCCESS, regions } }
    function failure(error) { return { type: regionConstants.GETALL_FAILURE, error } }
}

function getById(id) {
    return dispatch => {
        dispatch(request(id));

        regionService.getById(id)
            .then(
                region => dispatch(success(region)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: regionConstants.GET_REQUEST } }
    function success(region) { return { type: regionConstants.GET_SUCCESS, region } }
    function failure(id, error) { return { type: regionConstants.GET_FAILURE, id, error } }
}

function update(region) {
    return dispatch => {
        dispatch(request(region));

        regionService.update(region)
            .then(
                region => {
                    dispatch(success(region)),
                    dispatch(alertActions.success('region successfully Updated'))
                },
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: regionConstants.GET_REQUEST } }
    function success(region) { return { type: regionConstants.GET_SUCCESS, region } }
    function failure(error) { return { type: regionConstants.GET_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        regionService.delete(id)
            .then(
                region => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: regionConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: regionConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: regionConstants.DELETE_FAILURE, id, error } }
}