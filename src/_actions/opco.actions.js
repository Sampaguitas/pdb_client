import { opcoConstants } from '../_constants';
import { opcoService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const opcoActions = {
    create,
    getAll,
    getById,
    update,
    delete: _delete
};

function create(opco) {
    return dispatch => {
        dispatch(request(opco));

        opcoService.create(opco)
            .then(
                opco => {
                    dispatch(success(opco));
                    dispatch(alertActions.success('Opco successfully created'));
                    dispatch(opcoActions.getAll());
                    
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(opco) { return { type: opcoConstants.CREATE_REQUEST, opco } }
    function success(opco) { return { type: opcoConstants.CREATE_SUCCESS, opco } }
    function failure(error) { return { type: opcoConstants.CREATE_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        opcoService.getAll()
            .then(
                opcos => dispatch(success(opcos)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: opcoConstants.GETALL_REQUEST } }
    function success(opcos) { return { type: opcoConstants.GETALL_SUCCESS, opcos } }
    function failure(error) { return { type: opcoConstants.GETALL_FAILURE, error } }
}

function getById(id) {
    return dispatch => {
        dispatch(request(id));

        opcoService.getById(id)
            .then(
                opco => dispatch(success(opco)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: opcoConstants.GET_REQUEST } }
    function success(opco) { return { type: opcoConstants.GET_SUCCESS, opco } }
    function failure(id, error) { return { type: opcoConstants.GET_FAILURE, id, error } }
}

function update(opco) {
    return dispatch => {
        dispatch(request(opco));

        opcoService.update(opco)
            .then(
                opco => {
                    dispatch(success(opco)),
                    dispatch(alertActions.success('OPCO successfully updated'))
                },
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: opcoConstants.GET_REQUEST } }
    function success(opco) { return { type: opcoConstants.GET_SUCCESS, opco } }
    function failure(error) { return { type: opcoConstants.GET_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        opcoService.delete(id)
            .then(
                opco => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: opcoConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: opcoConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: opcoConstants.DELETE_FAILURE, id, error } }
}