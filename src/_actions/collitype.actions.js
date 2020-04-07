import { collitypeConstants } from '../_constants';
import { collitypeService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const collitypeActions = {
    getAll,
    clear
};

function getAll(projectId) {
    return dispatch => {
        dispatch(request(projectId));

        collitypeService.getAll(projectId)
            .then(
                collitypes => dispatch(success(collitypes)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(projectId) { return { type: collitypeConstants.GETALL_REQUEST, projectId } }
    function success(collitypes) { return { type: collitypeConstants.GETALL_SUCCESS, collitypes } }
    function failure(error) { return { type: collitypeConstants.GETALL_FAILURE, error } }
}

function clear() {
    return { type: collitypeConstants.CLEAR };
}