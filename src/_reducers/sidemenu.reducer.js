import { sidemenuConstants } from '../_constants';

export function sidemenu(state = { collapsed: true, selected: '' }, action) {
    switch (action.type) {
        case sidemenuConstants.TOGGLE: 
            return { collapsed: !state.collapsed, selected: state.selected }
        case sidemenuConstants.RESTORE: 
            return { collapsed: true, selected: '' }
        case sidemenuConstants.SELECT:
            return { collapsed: state.collapsed, selected: action.item }
        default: return state
    }
}