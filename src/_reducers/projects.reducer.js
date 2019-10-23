import { projectConstants } from '../_constants';

export function projects(state = {}, action) {
    switch (action.type) {
        case projectConstants.CREATE_REQUEST:
            return {
                projectCreating: true,
                items: action.projects
            };
        case projectConstants.CREATE_SUCCESS:
            return {
                items: action.projects
            };
        case projectConstants.CREATE_FAILURE:
            return {
                error: action.error
            };
        case projectConstants.GETALL_REQUEST:
            console.log('state:', state);    
        return {  
                projectLoading: true,
                items: state.items //keep existing state during request
            };
        case projectConstants.GETALL_SUCCESS:
            return {
                items: action.projects
            };
        case projectConstants.GETALL_FAILURE:
            return {
                error: action.error
            };
        case projectConstants.UPDATE_REQUEST:
            // add 'updating:true' property to project being updated
            return {
                ...state,
                items: state.items.map(project =>
                    project.id === action.id
                        ? { ...project, projectUpdating: true }
                        : project
                )
            };
        case projectConstants.UPDATE_SUCCESS:
            // update project from state
            return {
                items: state.items.filter(project => project.id !== action.id)
            };
        case projectConstants.UPDATE_FAILURE:
            // remove 'updating:true' property and add 'updateError:[error]' property to project 
            return {
                ...state,
                items: state.items.map(project => {
                    if (project.id === action.id) {
                        // make copy of project without 'updating:true' property
                        const { projectUpdating, ...projectCopy } = project;
                        // return copy of project with 'updateError:[error]' property
                        return { ...projectCopy, updateError: action.error };
                    }

                    return project;
                })
            };
        case projectConstants.DELETE_REQUEST:
            // add 'deleting:true' property to project being deleted
            return {
                ...state,
                items: state.items.map(project =>
                    project.id === action.id
                        ? { ...project, projectDeleting: true }
                        : project
                )
            };
        case projectConstants.DELETE_SUCCESS:
            // remove deleted project from state
            return {
                items: state.items.filter(project => project.id !== action.id)
            };
        case projectConstants.DELETE_FAILURE:
            // remove 'deleting:true' property and add 'deleteError:[error]' property to project 
            return {
                ...state,
                items: state.items.map(project => {
                    if (project.id === action.id) {
                        // make copy of project without 'deleting:true' property
                        const { projectDeleting, ...projectCopy } = project;
                        // return copy of project with 'deleteError:[error]' property
                        return { ...projectCopy, deleteError: action.error };
                    }

                    return project;
                })
            };
        case projectConstants.CLEAR_PROJECTS:
            return {};
        default:
            return state
    }
}