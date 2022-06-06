export function get_accounts_query_variables(searchName) {
  let queryVars = {
    instructor: undefined,
    employee: undefined,
    searchName: undefined,
  }

  if (searchName) {
    queryVars.searchName = searchName
  }

  return queryVars
}

export function get_attendance_list_query_variables(schedule_item_id, date) {
  return {
    scheduleItem: schedule_item_id,
    date: date
  }
}
