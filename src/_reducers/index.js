import { combineReducers } from 'redux';

import { alert } from './alert.reducer';
import { authentication } from './authentication.reducer';
import { currencies } from './currencies.reducer';
import { customers } from './customers.reducer';
import { incoterms } from './incoterms.reducer';
import { opcos } from './opcos.reducer';
import { projects } from './projects.reducer';
import { registration } from './registration.reducer';
import { users } from './users.reducer';

const rootReducer = combineReducers({
  alert,
  authentication,
  currencies,
  customers,
  incoterms,
  opcos,
  projects,
  registration,
  users
});

export default rootReducer;