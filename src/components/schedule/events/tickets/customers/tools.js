export function getAccountsQueryVariables(ticketId, searchName) {
  let queryVars = {
    instructor: undefined,
    employee: undefined,
    searchName: undefined,
    ticketId: ticketId
  }

  queryVars.searchName = searchName

  console.log(queryVars)

  return queryVars
}

// export function get_attendance_list_query_variables(schedule_item_id, date) {
//   return {
//     scheduleItem: schedule_item_id,
//     date: date
//   }
// }
