import CSLS from "../../../../../tools/cs_local_storage"
import { withRouter } from "react-router"

export function get_accounts_query_variables() {
  let queryVars = {
    instructor: undefined,
    employee: undefined,
    searchName: undefined
  }

  let search = localStorage.getItem(CSLS.SCHEDULE_CLASSES_CLASS_ATTENDANCE_SEARCH)
  queryVars.searchName = search

  console.log(queryVars)

  return queryVars
}

export function get_attendance_list_query_variables(schedule_item_id, date) {
  return {
    scheduleItem: schedule_item_id,
    date: date
  }
}
