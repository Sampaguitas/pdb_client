import { combineReducers } from 'redux';

import { alert } from './alert.reducer';
import { authentication } from './authentication.reducer';
import { currencies } from './currencies.reducer';
import { doctypes } from './doctypes.reducer';
import { erps } from './erps.reducer';
import { fields } from './fields.reducer';
import { fieldnames } from './fieldnames.reducer';
import { locales } from './locales.reducer';
import { opcos } from './opcos.reducer';
import { projects } from './projects.reducer';
import { regions } from './regions.reducer';
import { registration } from './registration.reducer';
import { requestpwd } from './requestpwd.reducer';
import { screens } from './screens.reducer';
import { selection } from './selection.reducer';
import { suppliers } from './suppliers.reducer';
import { users } from './users.reducer';

const rootReducer = combineReducers({
  alert,
  authentication,
  currencies,
  doctypes,
  erps,
  fields,
  fieldnames,
  locales,
  opcos,
  projects,
  regions,
  registration,
  requestpwd,
  screens,
  selection,
  suppliers,
  users
});

export default rootReducer;