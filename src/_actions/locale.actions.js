import { localeConstants } from '../_constants';
import { localeService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const localeActions = {
    create,
    getAll,
    getById,
    update,
    delete: _delete
};

function create(locale) {
    return dispatch => {
        dispatch(request(locale));

        localeService.create(locale)
            .then(
                locale => {
                    dispatch(success());
                    // history.push('/');
                    dispatch(alertActions.success('successfully Created'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(locale) { return { type: localeConstants.CREATE_REQUEST, locale } }
    function success(locale) { return { type: localeConstants.CREATE_SUCCESS, locale } }
    function failure(error) { return { type: localeConstants.CREATE_FAILURE, error } }
}

function getAll() {
    return dispatch => {
        dispatch(request());

        localeService.getAll()
            .then(
                locales => dispatch(success(locales)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: localeConstants.GETALL_REQUEST } }
    function success(locales) { return { type: localeConstants.GETALL_SUCCESS, locales } }
    function failure(error) { return { type: localeConstants.GETALL_FAILURE, error } }
}

function getById(id) {
    return dispatch => {
        dispatch(request(id));

        localeService.getById(id)
            .then(
                locale => dispatch(success(locale)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: localeConstants.GET_REQUEST } }
    function success(locale) { return { type: localeConstants.GET_SUCCESS, locale } }
    function failure(id, error) { return { type: localeConstants.GET_FAILURE, id, error } }
}

function update(locale) {
    return dispatch => {
        dispatch(request(locale));

        localeService.update(locale)
            .then(
                locale => {
                    dispatch(success(locale)),
                    dispatch(alertActions.success('Locale successfully Updated'))
                },
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: localeConstants.GET_REQUEST } }
    function success(locale) { return { type: localeConstants.GET_SUCCESS, locale } }
    function failure(error) { return { type: localeConstants.GET_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        localeService.delete(id)
            .then(
                locale => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: localeConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: localeConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: localeConstants.DELETE_FAILURE, id, error } }
}