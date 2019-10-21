import { supplierConstants } from '../_constants';
import { supplierService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const supplierActions = {
    create,
    getAll,
    getById,
    update,
    delete: _delete
};

function create(supplier) {
    return dispatch => {
        dispatch(request(supplier));

        supplierService.create(supplier)
            .then(
                supplier => {
                    dispatch(success());
                    dispatch(alertActions.success('supplier successfully created'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(supplier) { return { type: supplierConstants.CREATE_REQUEST, supplier } }
    function success(supplier) { return { type: supplierConstants.CREATE_SUCCESS, supplier } }
    function failure(error) { return { type: supplierConstants.CREATE_FAILURE, error } }
}

function getAll(projectId) {
    return dispatch => {
        dispatch(request(projectId));

        supplierService.getAll(projectId)
            .then(
                suppliers => dispatch(success(suppliers)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(projectId) { return { type: supplierConstants.GETALL_REQUEST, projectId } }
    function success(suppliers) { return { type: supplierConstants.GETALL_SUCCESS, suppliers } }
    function failure(error) { return { type: supplierConstants.GETALL_FAILURE, error } }
}

function getById(id) {
    return dispatch => {
        dispatch(request(id));

        supplierService.getById(id)
            .then(
                supplier => dispatch(success(supplier)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: supplierConstants.GET_REQUEST } }
    function success(supplier) { return { type: supplierConstants.GET_SUCCESS, supplier } }
    function failure(id, error) { return { type: supplierConstants.GET_FAILURE, id, error } }
}

function update(supplier) {
    return dispatch => {
        dispatch(request(supplier));

        supplierService.update(supplier)
            .then(
                supplier => {
                    dispatch(success(supplier)),
                    dispatch(alertActions.success('supplier successfully updated'))
                },
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: supplierConstants.UPDATE_REQUEST } }
    function success(supplier) { return { type: supplierConstants.UPDATE_SUCCESS, supplier } }
    function failure(error) { return { type: supplierConstants.UPDATE_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        supplierService.delete(id)
            .then(
                supplier => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: supplierConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: supplierConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: supplierConstants.DELETE_FAILURE, id, error } }
}