import { whcollipackConstants } from '../_constants';
import { whcollipackService } from '../_services';

export const whcollipackActions = {
    getAll,
    clear
};

function getAll(projectId) {
    return dispatch => {
        dispatch(request(projectId));

        whcollipackService.getAll(projectId)
            .then(
                whcollipacks => dispatch(success(whcollipacks)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(projectId) { return { type: whcollipackConstants.GETALL_REQUEST, projectId } }
    function success(whcollipacks) { return { type: whcollipackConstants.GETALL_SUCCESS, whcollipacks } }
    function failure(error) { return { type: whcollipackConstants.GETALL_FAILURE, error } }
}

function clear() {
    return { type: whcollipackConstants.CLEAR };
}