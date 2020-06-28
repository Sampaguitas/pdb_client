import { sidemenuConstants } from '../_constants';
import { sidemenuService } from '../_services';

export const sidemenuActions = {
    toggle,
    select,
    restore
};

function toggle() {
    return { type: sidemenuConstants.TOGGLE };
}

function select(item) {
    return dispatch =>  {

        sidemenuService.select(item)
        .then(item => dispatch(success(item)));
    }
    function success(item) { return { type: sidemenuConstants.SELECT, item } }
}

function restore() {
    return { type: sidemenuConstants.RESTORE };
}