import { settingConstants } from '../_constants';
import { settingService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const settingActions = {
    getAll,
    clear
};

function getAll(projectId, userId) {
    return dispatch => {
        dispatch(request(projectId, userId));

        settingService.getAll(projectId, userId)
            .then(
                settings => dispatch(success(settings)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(projectId, userId) { return { type: settingConstants.GETALL_REQUEST, projectId, userId } }
    function success(settings) { return { type: settingConstants.GETALL_SUCCESS, settings } }
    function failure(error) { return { type: settingConstants.GETALL_FAILURE, error } }
}

function clear() {
    return { type: settingConstants.CLEAR };
}