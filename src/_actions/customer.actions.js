import { customerConstants } from '../_constants';
import { customerService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const customerActions = {
    create,
    getAll,
    getById,
    update,
    delete: _delete
};

function create(customer) {
    return dispatch => {
        dispatch(request(customer));

        customerService.create(customer)
            .then(
                customer => {
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

    function request(customer) { return { type: customerConstants.CREATE_REQUEST, customer } }
    function success(customer) { return { type: customerConstants.CREATE_SUCCESS, customer } }
    function failure(error) { return { type: customerConstants.CREATE_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        customerService.getAll()
            .then(
                customers => dispatch(success(customers)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: customerConstants.GETALL_REQUEST } }
    function success(customers) { return { type: customerConstants.GETALL_SUCCESS, customers } }
    function failure(error) { return { type: customerConstants.GETALL_FAILURE, error } }
}

function getById(id) {
    return dispatch => {
        dispatch(request(id));

        customerService.getById(id)
            .then(
                customer => dispatch(success(customer)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: customerConstants.GET_REQUEST } }
    function success(customer) { return { type: customerConstants.GET_SUCCESS, customer } }
    function failure(id, error) { return { type: customerConstants.GET_FAILURE, id, error } }
}

function update(customer) {
    return dispatch => {
        dispatch(request(customer));

        customerService.update(customer)
            .then(
                customer => {
                    dispatch(success(customer)),
                    dispatch(alertActions.success('Customer successfully Updated'))
                },
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: customerConstants.GET_REQUEST } }
    function success(customer) { return { type: customerConstants.GET_SUCCESS, customer } }
    function failure(error) { return { type: customerConstants.GET_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        customerService.delete(id)
            .then(
                customer => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: customerConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: customerConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: customerConstants.DELETE_FAILURE, id, error } }
}