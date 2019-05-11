import { combineReducers } from 'redux';

import { alert } from './alert.reducer';
import { authentication } from './authentication.reducer';
import { opcos } from './opcos.reducer';
import { projects } from './projects.reducer';
import { registration } from './registration.reducer';
import { users } from './users.reducer';

const rootReducer = combineReducers({
  alert,
  authentication,
  opcos,
  projects,
  registration,
  users
});

export default rootReducer;