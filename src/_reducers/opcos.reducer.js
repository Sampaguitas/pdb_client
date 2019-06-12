import { opcoConstants } from '../_constants';

export function opcos(state = {}, action) {
    switch (action.type) {
        case opcoConstants.CREATE_REQUEST:
            return {
                opcoCreating: true,
                items: action.opcos
            };
        case opcoConstants.CREATE_SUCCESS:
            return {
                items: action.opcos
            };
        case opcoConstants.CREATE_FAILURE:
            return {
                error: action.error
            };
        case opcoConstants.GET_REQUEST:
            return {
                opcoLoading: true
            };
        case opcoConstants.GET_SUCCESS:
            return {
                items: action.opcos
            };
        case opcoConstants.GET_FAILURE:
            return {
                error: action.error
            };
        case opcoConstants.GETALL_REQUEST:
            return {
                opcoLoading: true
            };
        case opcoConstants.GETALL_SUCCESS:
            return {
                items: action.opcos
            };
        case opcoConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case opcoConstants.UPDATE_REQUEST:
            // add 'updating:true' property to opco being updated
            return {
                ...state,
                items: state.items.map(opco =>
                    opco.id === action.id
                        ? { ...opco, opcoUpdating: true }
                        : opco
                )
            };
        case opcoConstants.UPDATE_SUCCESS:
            // update opco from state
            return {
                items: state.items.filter(opco => opco.id !== action.id)
            };
        case opcoConstants.UPDATE_FAILURE:
            // remove 'updating:true' property and add 'updateError:[error]' property to opco 
            return {
                ...state,
                items: state.items.map(opco => {
                    if (opco.id === action.id) {
                        // make copy of opco without 'updating:true' property
                        const { opcoUpdating, ...opcoCopy } = opco;
                        // return copy of opco with 'updateError:[error]' property
                        return { ...opcoCopy, updateError: action.error };
                    }

                    return opco;
                })
            };
        case opcoConstants.DELETE_REQUEST:
            // add 'deleting:true' property to opco being deleted
            return {
                ...state,
                items: state.items.map(opco =>
                    opco.id === action.id
                        ? { ...opco, opcoDeleting: true }
                        : opco
                )
            };
        case opcoConstants.DELETE_SUCCESS:
            // remove deleted opco from state
            return {
                items: state.items.filter(opco => opco.id !== action.id)
            };
        case opcoConstants.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to opco 
            return {
                ...state,
                items: state.items.map(opco => {
                    if (opco.id === action.id) {
                        // make copy of opco without 'deleting:true' property
                        const { opcoDeleting, ...opcoCopy } = opco;
                        // return copy of opco with 'deleteError:[error]' property
                        return { ...opcoCopy, deleteError: action.error };
                    }

                    return opco;
                })
            };
        default:
            return state
    }
}