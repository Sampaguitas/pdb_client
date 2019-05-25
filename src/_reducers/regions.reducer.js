import { regionConstants } from '../_constants';

export function regions(state = {}, action) {
    switch (action.type) {
        case regionConstants.CREATE_REQUEST:
            return {
                loading: true,
                items: action.regions
            };
        case regionConstants.CREATE_SUCCESS:
            return {
                items: action.regions
            };
        case regionConstants.CREATE_FAILURE:
            return {
                error: action.error
            };
        case regionConstants.GET_REQUEST:
            return {
                loading: true
            };
        case regionConstants.GET_SUCCESS:
            return {
                items: action.regions
            };
        case regionConstants.GET_FAILURE:
            return {
                error: action.error
            };
        case regionConstants.GETALL_REQUEST:
            return {
                loading: true
            };
        case regionConstants.GETALL_SUCCESS:
            return {
                items: action.regions
            };
        case regionConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case regionConstants.UPDATE_REQUEST:
            // add 'updating:true' property to region being updated
            return {
                ...state,
                items: state.items.map(region =>
                    region.id === action.id
                        ? { ...region, updating: true }
                        : region
                )
            };
        case regionConstants.UPDATE_SUCCESS:
            // update region from state
            return {
                items: state.items.filter(region => region.id !== action.id)
            };
        case regionConstants.UPDATE_FAILURE:
            // remove 'updating:true' property and add 'updateError:[error]' property to region 
            return {
                ...state,
                items: state.items.map(region => {
                    if (region.id === action.id) {
                        // make copy of region without 'updating:true' property
                        const { updating, ...regionCopy } = region;
                        // return copy of region with 'updateError:[error]' property
                        return { ...regionCopy, updateError: action.error };
                    }

                    return region;
                })
            };
        case regionConstants.DELETE_REQUEST:
            // add 'deleting:true' property to region being deleted
            return {
                ...state,
                items: state.items.map(region =>
                    region.id === action.id
                        ? { ...region, deleting: true }
                        : region
                )
            };
        case regionConstants.DELETE_SUCCESS:
            // remove deleted region from state
            return {
                items: state.items.filter(region => region.id !== action.id)
            };
        case regionConstants.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to region 
            return {
                ...state,
                items: state.items.map(region => {
                    if (region.id === action.id) {
                        // make copy of region without 'deleting:true' property
                        const { deleting, ...regionCopy } = region;
                        // return copy of region with 'deleteError:[error]' property
                        return { ...regionCopy, deleteError: action.error };
                    }

                    return region;
                })
            };
        default:
            return state
    }
}