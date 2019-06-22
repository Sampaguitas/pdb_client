import { combineReducers } from 'redux';

import { alert } from './alert.reducer';
import { authentication } from './authentication.reducer';
import { currencies } from './currencies.reducer';
import { erps } from './erps.reducer';
import { locales } from './locales.reducer';
import { opcos } from './opcos.reducer';
import { projects } from './projects.reducer';
import { regions } from './regions.reducer';
import { registration } from './registration.reducer';
import { screens } from './screens.reducer';
import { selection } from './selection.reducer';
import { suppliers } from './suppliers.reducer';
import { users } from './users.reducer';

const rootReducer = combineReducers({
  alert,
  authentication,
  currencies,
  erps,
  locales,
  opcos,
  projects,
  regions,
  registration,
  screens,
  selection,
  suppliers,
  users
});

export default rootReducer;