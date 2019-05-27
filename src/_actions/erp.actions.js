import { erpConstants } from '../_constants';
import { erpService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const erpActions = {
    create,
    getAll,
    getById,
    update,
    delete: _delete
};

function create(erp) {
    return dispatch => {
        dispatch(request(erp));

        erpService.create(erp)
            .then(
                erp => {
                    dispatch(success());
                    // history.push('/');
                    dispatch(alertActions.success('Erp successfully created'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(erp) { return { type: erpConstants.CREATE_REQUEST, erp } }
    function success(erp) { return { type: erpConstants.CREATE_SUCCESS, erp } }
    function failure(error) { return { type: erpConstants.CREATE_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        erpService.getAll()
            .then(
                erps => dispatch(success(erps)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: erpConstants.GETALL_REQUEST } }
    function success(erps) { return { type: erpConstants.GETALL_SUCCESS, erps } }
    function failure(error) { return { type: erpConstants.GETALL_FAILURE, error } }
}

function getById(id) {
    return dispatch => {
        dispatch(request(id));

        erpService.getById(id)
            .then(
                erp => dispatch(success(erp)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: erpConstants.GET_REQUEST } }
    function success(erp) { return { type: erpConstants.GET_SUCCESS, erp } }
    function failure(id, error) { return { type: erpConstants.GET_FAILURE, id, error } }
}

function update(erp) {
    return dispatch => {
        dispatch(request(erp));

        erpService.update(erp)
            .then(
                erp => {
                    dispatch(success(erp)),
                    dispatch(alertActions.success('Erp successfully updated'))
                },
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: erpConstants.GET_REQUEST } }
    function success(erp) { return { type: erpConstants.GET_SUCCESS, erp } }
    function failure(error) { return { type: erpConstants.GET_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        erpService.delete(id)
            .then(
                erp => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: erpConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: erpConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: erpConstants.DELETE_FAILURE, id, error } }
}