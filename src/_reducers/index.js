import { combineReducers } from 'redux';

import { accesses } from './accesses.reducer';
import { alert } from './alert.reducer';
import { authentication } from './authentication.reducer';
import { certificates } from './certificates.reducer';
import { collitypes } from './collitypes.reducer';
import { collipacks } from './collipacks.reducer';
import { currencies } from './currencies.reducer';
import { docdefs } from './docdefs.reducer';
import { docfields } from './docfields.reducer';
import { doctypes } from './doctypes.reducer';
import { erps } from './erps.reducer';
import { fieldnames } from './fieldnames.reducer';
import { fields } from './fields.reducer';
import { heatlocs } from './heatlocs.reducer';
import { heatpicks } from './heatpicks.reducer';
import { locales } from './locales.reducer';
import { mirs } from './mirs.reducer';
import { opcos } from './opcos.reducer';
import { picktickets } from './picktickets.reducer';
import { pos } from './pos.reducer';
import { projects } from './projects.reducer';
import { regions } from './regions.reducer';
import { registration } from './registration.reducer';
import { requestpwd } from './requestpwd.reducer';
import { resetpwd } from './resetpwd.reducer';
import { screens } from './screens.reducer';
import { selection } from './selection.reducer';
import { settings } from './settings.reducer';
import { sidemenu } from './sidemenu.reducer';
import { suppliers } from './suppliers.reducer';
import { transactions } from './transactions.reducer';
import { users } from './users.reducer';
import { warehouses } from './warehouses.reducer';
import { whcollipacks } from './whcollipacks.reducer';

const rootReducer = combineReducers({
  accesses,
  alert,
  authentication,
  certificates,
  sidemenu,
  collitypes,
  collipacks,
  currencies,
  docdefs,
  docfields,
  doctypes,
  erps,
  fieldnames,
  fields,
  heatlocs,
  heatpicks,
  locales,
  mirs,
  opcos,
  picktickets,
  pos,
  projects,
  regions,
  registration,
  requestpwd,
  resetpwd,
  screens,
  selection,
  settings,
  suppliers,
  transactions,
  users,
  warehouses,
  whcollipacks
});

export default rootReducer;