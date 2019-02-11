import { projectConstants } from '../_constants';
import { projectService } from '../_services';
import { alertActions, customerActions, opcoActions } from './';
import { history } from '../_helpers';

export const projectActions = {
    create,
    getAll,
    getById,
    update,
    delete: _delete
};

function create(project) {
    return dispatch => {
        dispatch(request(project));

        projectService.create(project)
            .then(
                project => {
                    dispatch(success());
                    dispatch(alertActions.success('successfully Created'));
                    dispatch(customerActions.getAll());
                    dispatch(opcoActions.getAll());
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(project) { return { type: projectConstants.CREATE_REQUEST, project } }
    function success(project) { return { type: projectConstants.CREATE_SUCCESS, project } }
    function failure(error) { return { type: projectConstants.CREATE_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        projectService.getAll()
            .then(
                projects => dispatch(success(projects)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: projectConstants.GETALL_REQUEST } }
    function success(projects) { return { type: projectConstants.GETALL_SUCCESS, projects } }
    function failure(error) { return { type: projectConstants.GETALL_FAILURE, error } }
}

function getById(id) {
    return dispatch => {
        dispatch(request(id));

        projectService.getById(id)
            .then(
                project => dispatch(success(project)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: projectConstants.GET_REQUEST } }
    function success(project) { return { type: projectConstants.GET_SUCCESS, project } }
    function failure(id, error) { return { type: projectConstants.GET_FAILURE, id, error } }
}

function update(project) {
    return dispatch => {
        dispatch(request(project));

        projectService.update(project)
            .then(
                project => {
                    dispatch(success(project)),
                    dispatch(alertActions.success('Project successfully Updated'))
                },
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: projectConstants.GET_REQUEST } }
    function success(project) { return { type: projectConstants.GET_SUCCESS, project } }
    function failure(error) { return { type: projectConstants.GET_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        projectService.delete(id)
            .then(
                project => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: projectConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: projectConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: projectConstants.DELETE_FAILURE, id, error } }
}