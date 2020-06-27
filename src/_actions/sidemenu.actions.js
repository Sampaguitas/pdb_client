import { sidemenuConstants } from '../_constants';

export const sidemenuActions = {
    toggle,
    restore
};

function toggle() {
    return { type: sidemenuConstants.TOGGLE };
}

function restore() {
    return { type: sidemenuConstants.RESTORE };
}