import { pickticketConstants } from '../_constants';
import { pickticketService } from '../_services';

export const pickticketActions = {
    getAll,
    clear
};

function getAll(projectId) {
    return dispatch => {
        dispatch(request(projectId));

        pickticketService.getAll(projectId)
            .then(
                picktickets => dispatch(success(picktickets)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(projectId) { return { type: pickticketConstants.GETALL_REQUEST, projectId } }
    function success(picktickets) { return { type: pickticketConstants.GETALL_SUCCESS, picktickets } }
    function failure(error) { return { type: pickticketConstants.GETALL_FAILURE, error } }
}

function clear() {
    return { type: pickticketConstants.CLEAR };
}