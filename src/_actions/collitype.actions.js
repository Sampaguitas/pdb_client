import { collitypeConstants } from '../_constants';
import { collitypeService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const collitypeActions = {
    create,
    getAll,
    getById,
    update,
    delete: _delete,
    clear
};

function create(collitype) {
    return dispatch => {
        dispatch(request(collitype));

        collitypeService.create(collitype)
            .then(
                collitype => {
                    dispatch(success(collitype)),
                    dispatch(collitypeService.getAll(collitype.projectId)),
                    dispatch(alertActions.success('Access successfully created'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(collitype) { return { type: collitypeConstants.CREATE_REQUEST, collitype } }
    function success(collitype) { return { type: collitypeConstants.CREATE_SUCCESS, collitype } }
    function failure(error) { return { type: collitypeConstants.CREATE_FAILURE, error } }
}


function getAll(projectId) {
    return dispatch => {
        dispatch(request(projectId));

        collitypeService.getAll(projectId)
            .then(
                collitypes => dispatch(success(collitypes)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(projectId) { return { type: collitypeConstants.GET_REQUEST, projectId } }
    function success(collitypes) { return { type: collitypeConstants.GET_SUCCESS, collitypes } }
    function failure(error) { return { type: collitypeConstants.GET_FAILURE, error } }
}

function getById(id) {
    return dispatch => {
        dispatch(request(id));

        collitypeService.getById(id)
            .then(
                collitype => dispatch(success(collitype)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(id) { return { type: collitypeConstants.GET_REQUEST, id } }
    function success(collitype) { return { type: collitypeConstants.GET_SUCCESS, collitype } }
    function failure(id, error) { return { type: collitypeConstants.GET_FAILURE, id, error } }
}

function update(collitype) {
    return dispatch => {
        dispatch(request(collitype));

        collitypeService.update(collitype)
            .then(
                collitype => {
                    dispatch(success(collitype)),
                    dispatch(alertActions.success('Access successfully updated'))
                },
                error => dispatch(failure(error.toString()))
            );
    };
    function request() { return { type: collitypeConstants.UPDATE_REQUEST } }
    function success(collitype) { return { type: collitypeConstants.UPDATE_SUCCESS, collitype } }
    function failure(error) { return { type: collitypeConstants.UPDATE_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        collitypeService.delete(id)
            .then(
                collitype => {
                    dispatch(success(id)),
                    dispatch(alertActions.success('Access successfully deleted')),
                    dispatch(collitypeService.getAll(collitype.projectId)) 
                },
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: collitypeConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: collitypeConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: collitypeConstants.DELETE_FAILURE, id, error } }
}

function clear() {
    return { type: collitypeConstants.CLEAR };
}