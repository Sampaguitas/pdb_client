import { transactionConstants } from '../_constants';
import { transactionService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const transactionActions = {
    getAll,
    clear
};

function getAll(projectId) {
    return dispatch => {
        dispatch(request(projectId));

        transactionService.getAll(projectId)
            .then(
                transactions => dispatch(success(transactions)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request(projectId) { return { type: transactionConstants.GETALL_REQUEST, projectId } }
    function success(transactions) { return { type: transactionConstants.GETALL_SUCCESS, transactions } }
    function failure(error) { return { type: transactionConstants.GETALL_FAILURE, error } }
}

function clear() {
    return { type: transactionConstants.CLEAR };
}