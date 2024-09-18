# revature-project_foundations
use dynamoDB with separate tables

two types of users:
    -shared traits
        
    -employee only traits
        -view past tickets
    -manager only traits
        -approve/deny tickets
        -filter tickets by status

tickets:
    -Tickets can be Approved or Denied
    -Tickets cannot change status after processing
    -Pending tickets should be added to a queue or list that managers can see
    -Tickets should be removed from the list, or queue, once processed (approved/denied) by a manager

two tables needed:
employees
tickets
