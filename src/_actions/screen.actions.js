import { screenConstants } from '../_constants';
import { screenService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const screenActions = {
    create,
    getAll,
    getById,
    update,
    delete: _delete
};

function create(screen) {
    return dispatch => {
        dispatch(request(screen));

        screenService.create(screen)
            .then(
                screen => {
                    dispatch(success());
                    // history.push('/');
                    dispatch(alertActions.success('screen successfully created'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(screen) { return { type: screenConstants.CREATE_REQUEST, screen } }
    function success(screen) { return { type: screenConstants.CREATE_SUCCESS, screen } }
    function failure(error) { return { type: screenConstants.CREATE_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        screenService.getAll()
            .then(
                screens => dispatch(success(screens)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: screenConstants.GETALL_REQUEST } }
    function success(screens) { return { type: screenConstants.GETALL_SUCCESS, screens } }
    function failure(error) { return { type: screenConstants.GETALL_FAILURE, error } }
}

function getById(id) {
    return dispatch => {
        dispatch(request(id));

        screenService.getById(id)
            .then(
                screen => dispatch(success(screen)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: screenConstants.GET_REQUEST } }
    function success(screen) { return { type: screenConstants.GET_SUCCESS, screen } }
    function failure(id, error) { return { type: screenConstants.GET_FAILURE, id, error } }
}

function update(screen) {
    return dispatch => {
        dispatch(request(screen));

        screenService.update(screen)
            .then(
                screen => {
                    dispatch(success(screen)),
                    dispatch(alertActions.success('screen successfully updated'))
                },
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: screenConstants.GET_REQUEST } }
    function success(screen) { return { type: screenConstants.GET_SUCCESS, screen } }
    function failure(error) { return { type: screenConstants.GET_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        screenService.delete(id)
            .then(
                screen => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: screenConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: screenConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: screenConstants.DELETE_FAILURE, id, error } }
}