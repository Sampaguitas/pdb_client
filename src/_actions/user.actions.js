import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions, projectActions } from './';
import { history } from '../_helpers';

export const userActions = {
    login,
    logout,
    register,
    getAll,
    update,
    changePwd,
    setAdmin,
    setSpAdmin,
    requestPwd,
    resetPwd,
    delete: _delete
};

function login(email, password) {
    return dispatch => {
        dispatch(request({ email }));

        userService.login(email, password)
            .then(
                user => { 
                    dispatch(success(user));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

function register(user) {
    return dispatch => {
        dispatch(request(user));

        userService.register(user)
            .then(
                user => { 
                    dispatch(success());
                    dispatch(userActions.getAll(user));
                    dispatch(alertActions.success('User successfully created'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        userService.getAll()
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}

function update(user) {
    return dispatch => {
        dispatch(request(user));

        userService.update(user)
            .then(
                user => {
                    dispatch(success(user)),
                    dispatch(alertActions.success('User successfully updated')),
                    dispatch(userActions.getAll(user));
                },
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: userConstants.UPDATE_REQUEST } }
    function success(user) { return { type: userConstants.UPDATE_SUCCESS, user } }
    function failure(error) { return { type: userConstants.UPDATE_FAILURE, error } }
}

function changePwd(user) {
    return dispatch => {
        dispatch(request(user));

        userService.changePwd(user)
            .then(
                user => {
                    dispatch(success(user));
                    dispatch(alertActions.success('Password successfully updated'));
                },
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: userConstants.CHANGEPWD_REQUEST } }
    function success(user) { return { type: userConstants.CHANGEPWD_SUCCESS, user } }
    function failure(error) { return { type: userConstants.CHANGEPWD_FAILURE, error } }
}

function setAdmin(user) {
    return dispatch => {
        dispatch(request(user));

        userService.setAdmin(user)
            .then(
                user => {
                    dispatch(success(user)),
                    dispatch(userActions.getAll(user));
                },
                error => {
                    dispatch(failure(error.toString()))
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: userConstants.SETADMIN_REQUEST } }
    function success(user) { return { type: userConstants.SETADMIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.SETADMIN_FAILURE, error } }
}

function setSpAdmin(user) {
    return dispatch => {
        dispatch(request(user));

        userService.setSpAdmin(user)
            .then(
                user => {
                    dispatch(success(user)),
                    dispatch(userActions.getAll(user));
                },
                error => {
                    dispatch(failure(error.toString()))
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request() { return { type: userConstants.SETSPADMIN_REQUEST } }
    function success(user) { return { type: userConstants.SETSPADMIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.SETSPADMIN_FAILURE, error } }
}

function requestPwd(email) {
    return dispatch => {
        dispatch(request(email));

        userService.requestPwd(email)
            .then(
                response => {
                    dispatch(success(response)),
                    dispatch(alertActions.success('Check your email to reset your password'));
                },
                error => {
                    dispatch(failure(error.toString()))
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(email) { return { type: userConstants.REQUESTPWD_REQUEST, email } }
    function success(email) { return { type: userConstants.REQUESTPWD_SUCCESS, email } }
    function failure(email, error) { return { type: userConstants.REQUESTPWD_FAILURE, email, error } }
}

function resetPwd(user) {
    return dispatch => {
        dispatch(request(user));

        userService.resetPwd(user)
            .then(
                response => {
                    dispatch(success(response)),
                    dispatch(alertActions.success('Your Passowrd has been changed'));
                },
                error => {
                    dispatch(failure(error.toString()))
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.REQUESTPWD_REQUEST, user } }
    function success(user) { return { type: userConstants.REQUESTPWD_SUCCESS, user } }
    function failure(user, error) { return { type: userConstants.REQUESTPWD_FAILURE, user, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        userService.delete(id)
            .then(
                user => {
                    dispatch(success(id)),
                    dispatch(alertActions.success('User successfully deleted')),
                    dispatch(userActions.getAll(user));
                },
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: userConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: userConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: userConstants.DELETE_FAILURE, id, error } }
}