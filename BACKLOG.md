# Tour Of Bonds Lab Backlog

Story Id|Story Type|Description|Acceptance Criteria|Status|Assignee
---: | --- | --- | --- | --- | ---
1 | TASK | Create broken Tour Of Bonds app | App available on github | COMPLETE | andrebrowne + 1
2 | TASK | Install App on workstation | App, unit tests and e2e tests run on workstation | IN-PROGRESS | TBD
4 | TASK | Fix Tour Of Bonds app unit tests | All unit test specs pass | TODO | TBD
3 | TASK | Fix Tour Of Bonds app e2e tests | All e2e test specs pass | TODO | TBD
6 | FEAT | Add price to bond | **Given** a bond exists, **when** a user views the bond details, **then** the bond name and bond price are displayed | TO-DO | TBD
5 | FEAT | Create a bond with optional price | **Given** a user adds a new bond, **when** the user submits the new bond details, **then** the bond name and optionally the bond price are saved by the app | TO-DO | TBD
7 | FEAT | Create an RESTful API for Tour of Bonds app | App uses live RESTful API endpoints | TO-DO | TBD
20 | FEAT | Prevent bond duplicates | **Given** a user adds a new bond with the name of an existing bond, **when** the user submits the new bond details, **then** the app does not save the bond and writes a message stating "[bond name] Bond already exists" | TO-DO | TBD
21 | FEAT | Confirm bond deletion | **Given** a bond exists, **when** the user deletes the bond, **then** the user has to confirm the deletion by answering the question "Please confirm deletion of [bond name]" with `CONFIRM` or `CANCEL` | TO-DO | TBD
