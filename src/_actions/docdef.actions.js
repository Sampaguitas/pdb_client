import { docdefConstants } from '../_constants';
import { docdefService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const docdefActions = {
    create,
    getAll,
    getById,
    update,
    delete: _delete,
    clear
};

function create(docdef) {
    return dispatch => {
        dispatch(request(docdef));

        docdefService.create(docdef)
            .then(
                docdef => {
                    dispatch(success());
                    dispatch(alertActions.success('docdef successfully created'));
                    dispatch(docdefActions.getAll(docdef.projectId));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(docdef) { return { type: docdefConstants.CREATE_REQUEST, docdef } }
    function success(docdef) { return { type: docdefConstants.CREATE_SUCCESS, docdef } }
    function failure(error) { return { type: docdefConstants.CREATE_FAILURE, error } }
}

function getAll(projectId) {
    return dispatch => {
        dispatch(request(projectId));

        docdefService.getAll(projectId)
            .then(
                docdefs => dispatch(success(docdefs)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(projectId) { return { type: docdefConstants.GETALL_REQUEST, projectId } }
    function success(docdefs) { return { type: docdefConstants.GETALL_SUCCESS, docdefs } }
    function failure(error) { return { type: docdefConstants.GETALL_FAILURE, error } }
}

function getById(id) {
    return dispatch => {
        dispatch(request(id));

        docdefService.getById(id)
            .then(
                docdef => dispatch(success(docdef)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: docdefConstants.GET_REQUEST } }
    function success(docdef) { return { type: docdefConstants.GET_SUCCESS, docdef } }
    function failure(id, error) { return { type: docdefConstants.GET_FAILURE, id, error } }
}

function update(docdef) {
    return dispatch => {
        dispatch(request(docdef));

        docdefService.update(docdef)
            .then(
                docdef => {
                    dispatch(success(docdef));
                    dispatch(alertActions.success('docdef successfully updated'));
                    dispatch(docdefActions.getAll(docdef.projectId));
                },
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: docdefConstants.UPDATE_REQUEST } }
    function success(docdef) { return { type: docdefConstants.UPDATE_SUCCESS, docdef } }
    function failure(error) { return { type: docdefConstants.UPDATE_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        docdefService.delete(id)
            .then(
                docdef => {
                    dispatch(success(id));
                    dispatch(docdefActions.getAll(docdef.projectId));
                },
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: docdefConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: docdefConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: docdefConstants.DELETE_FAILURE, id, error } }
}

function clear() {
    return { type: docdefConstants.CLEAR };
}