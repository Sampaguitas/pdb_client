import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { registration } from './registration.reducer';
import { users } from './users.reducer';
import { customers } from './customers.reducer';
import { opcos } from './opcos.reducer';
import { projects } from './projects.reducer';
import { alert } from './alert.reducer';

const rootReducer = combineReducers({
  authentication,
  registration,
  users,
  customers,
  opcos,
  projects,
  alert
});

export default rootReducer;