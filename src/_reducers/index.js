import { combineReducers } from 'redux';

import { alert } from './alert.reducer';
import { authentication } from './authentication.reducer';
import { currencies } from './currencies.reducer';
import { locales } from './locales.reducer';
import { opcos } from './opcos.reducer';
import { projects } from './projects.reducer';
import { registration } from './registration.reducer';
import { selection } from './selection.reducer';
import { users } from './users.reducer';

const rootReducer = combineReducers({
  alert,
  authentication,
  currencies,
  locales,
  opcos,
  projects,
  registration,
  selection,
  users
});

export default rootReducer;