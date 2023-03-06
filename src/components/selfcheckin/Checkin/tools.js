import CSLS from "../../../tools/cs_local_storage"
import moment from 'moment'

export function get_accounts_query_variables() {
  let queryVars = {
    instructor: undefined,
    employee: undefined,
    searchName: undefined
  }

  let search = localStorage.getItem(CSLS.SELFCHECKIN_CHECKIN_SEARCH)
  queryVars.searchName = search

  console.log(queryVars)

  return queryVars
}

export function get_attendance_list_query_variables(scheduleItemId, date) {
  return {
    scheduleItem: scheduleItemId,
    date: date
  }
}

export function getSubtitle(classDate, scheduleItem, dateTimeFormat) {
  return <span>
    {scheduleItem.organizationLocationRoom.organizationLocation.name} { " - " }
    {moment(classDate + " " +  scheduleItem.timeStart).format(dateTimeFormat)} { " " } 
    {scheduleItem.organizationClasstype.name} { " " }
  </span> 
}
