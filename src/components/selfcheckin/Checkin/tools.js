import moment from 'moment'

export function get_accounts_query_variables(searchName) {
  let queryVars = {
    searchName: undefined
  }

  queryVars.searchName = searchName

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
