import { userConstants } from '../_constants';

export function users(state = {}, action) {
  switch (action.type) {
    case userConstants.GETALL_REQUEST:
      return {
        loading: true
      };
    case userConstants.GETALL_SUCCESS:
      return {
        items: action.users
      };
    case userConstants.GETALL_FAILURE:
      return { 
        error: action.error
      };
    case userConstants.UPDATE_REQUEST:
      // add 'updating:true' property to opco being updated
      return {
        ...state,
        items: state.items.map(user =>
          user.id === action.id
            ? { ...user, updating: true }
            : user
        )
      };
    case userConstants.UPDATE_SUCCESS:
      // update opco from state
      return {
        items: state.items.filter(user => user.id !== action.id)
      };
    case userConstants.UPDATE_FAILURE:
      // remove 'updating:true' property and add 'updateError:[error]' property to opco 
      return {
        ...state,
        items: state.items.map(user => {
          if (user.id === action.id) {
            // make copy of user without 'updating:true' property
            const { updating, ...userCopy } = user;
            // return copy of user with 'updateError:[error]' property
            return { ...userCopy, updateError: action.error };
          }

          return user;
        })
      };
      case userConstants.CHANGEPWD_REQUEST:
      // add 'updating:true' property to opco being updated
      return {
        ...state,
        items: state.items.map(user =>
          user.id === action.id
            ? { ...user, updating: true }
            : user
        )
      };
    case userConstants.CHANGEPWD_SUCCESS:
      // update opco from state
      return {
        items: state.items.filter(user => user.id !== action.id)
      };
    case userConstants.CHANGEPWD_FAILURE:
      // remove 'updating:true' property and add 'updateError:[error]' property to opco 
      return {
        ...state,
        items: state.items.map(user => {
          if (user.id === action.id) {
            // make copy of user without 'updating:true' property
            const { updating, ...userCopy } = user;
            // return copy of user with 'updateError:[error]' property
            return { ...userCopy, updateError: action.error };
          }

          return user;
        })
      };
      case userConstants.SETADMIN_REQUEST:
        // add 'updating:true' property to opco being updated
        return {
          ...state,
          items: state.items.map(user =>
            user.id === action.id
              ? { ...user, updating: true }
              : user
          )
        };
      case userConstants.SETADMIN_SUCCESS:
        // update opco from state
        return {
          items: state.items.filter(user => user.id !== action.id)
        };
      case userConstants.SETADMIN_FAILURE:
        // remove 'updating:true' property and add 'updateError:[error]' property to opco 
        return {
          ...state,
          items: state.items.map(user => {
            if (user.id === action.id) {
              // make copy of user without 'updating:true' property
              const { updating, ...userCopy } = user;
              // return copy of user with 'updateError:[error]' property
              return { ...userCopy, updateError: action.error };
            }
  
            return user;
          })
        };
        case userConstants.SETSPADMIN_REQUEST:
          // add 'updating:true' property to opco being updated
          return {
            ...state,
            items: state.items.map(user =>
              user.id === action.id
                ? { ...user, updating: true }
                : user
            )
          };
        case userConstants.SETSPADMIN_SUCCESS:
          // update opco from state
          return {
            items: state.items.filter(user => user.id !== action.id)
          };
        case userConstants.SETSPADMIN_FAILURE:
          // remove 'updating:true' property and add 'updateError:[error]' property to opco 
          return {
            ...state,
            items: state.items.map(user => {
              if (user.id === action.id) {
                // make copy of user without 'updating:true' property
                const { updating, ...userCopy } = user;
                // return copy of user with 'updateError:[error]' property
                return { ...userCopy, updateError: action.error };
              }
    
              return user;
            })
          };
    case userConstants.DELETE_REQUEST:
      // add 'deleting:true' property to user being deleted
      return {
        ...state,
        items: state.items.map(user =>
          user.id === action.id
            ? { ...user, deleting: true }
            : user
        )
      };
    case userConstants.DELETE_SUCCESS:
      // remove deleted user from state
      return {
        items: state.items.filter(user => user.id !== action.id)
      };
    case userConstants.DELETE_FAILURE:
      // remove 'deleting:true' property and add 'deleteError:[error]' property to user 
      return {
        ...state,
        items: state.items.map(user => {
          if (user.id === action.id) {
            // make copy of user without 'deleting:true' property
            const { deleting, ...userCopy } = user;
            // return copy of user with 'deleteError:[error]' property
            return { ...userCopy, deleteError: action.error };
          }

          return user;
        })
      };
    default:
      return state
  }
}