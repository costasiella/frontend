import CSLS from "../../../../../tools/cs_local_storage"
import { withRouter } from "react-router"

export function getAccountsQueryVariables() {
  let queryVars = {
    instructor: undefined,
    employee: undefined,
    searchName: undefined
  }

  let search = localStorage.getItem(CSLS.SCHEDULE_CLASSES_CLASS_ENROLLMENTS_SEARCH)
  queryVars.searchName = search

  console.log(queryVars)

  return queryVars
}

export function getEnrollmentsListQueryVariables(scheduleItemId) {
  return {
    scheduleItem: scheduleItemId,
  }
}
