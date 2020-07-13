### Warehouse Transport Docs
- [X] User Settings: Filter / Display.
- [X] TableInput: upsert whPackitem.
- [X] Edit Values.
- [X] Delete Rows.
- [X] Get last PL / new PL number.
- [X] Assing PL.
- [X] Assign Colli.
- [X] remaining Qty (split line modal).
- [X] Split line (split line modal).
- [X] MiddleWare pre/post hooks.
### Warehouse Packing Details
- [X] Custom Table.
- [X] Delete Rows (disabled).
- [X] Edit Values modal.
- [X] Net Weight modal.
- [X] Assign Colli types & dimentions.
- [X] Print Shipping Documents.
### Stock Management
- [X] Goods returned modal.
- [X] Return schema (back end).
- [X] Return fields.
- [X] Download goods return DUF.
- [X] Upload goods return DUF.
- [X] Goods recipt (goods return radio/table).
- [X] show returns heats in certificate screen.
### Shipping Transport Docs
- [ ] MiddleWare pre/post hooks (to be fixed).
- [X] If inspection module disabled: relQty = splitQty (virtual).
- [X] Show relQty in split-window.
### Expediting
- [X] remove performance report screen and add generate report button to expediting screen.
### Minutes of Meeting
- [X] Goods receipt: alert-message if no remaining qty.
- [X] Goods receipt: qty field disabled if multiple line selected.
- [X] Goods receipt: correct remaining qty, no transaction if equal to 0.
- [X] Authentication: Change validity of the  token to one day.
- [X] Inputs type date: validation formats (autofill year, allow single digit day/month).
- [X] Qty picked: calculated from heats quantities.
- [X] Typos: Tcicket, whant.
- [X] Select Order Line: only available in stock (mir);
- [ ] Mir: isProcessed = true when all picktickets are closed and qtyPicked = qtyRequired.
- [X] Prevent users from creating two items if double click on create new row / add button.
### Styling
- [X] Reduce layout margins (layout).
- [X] Pass Menu collapsed state between screens (side menu).
- [X] Logo transition on menu expand/collapse (side menu).
- [X] Transition chevron on Item expand/collapse (side menu).
- [X] Transition sub items on Item expand/collapse (side menu).
- [X] Home Icon highlight on "/", main Item highlight on sub (side menu).
- [ ] Description on collapsed Menu icon hover.
### Wrap up
- [X] Refactor: 3,679 additions and 10,799 deletions.
- [X] Add new fields to master template,
- [X] Setup Master Template Screens,
- [X] Setup Master Template Documents,
- [ ] Back up database,
- [ ] Remove all projects eccept master template,
- [ ] README.md: How to set up pdb_server/database (Github),
- [ ] Finalise Manual,