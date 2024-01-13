import CSLS from "../../../tools/cs_local_storage"

export function get_list_query_variables() {
  let archived = localStorage.getItem(CSLS.SCHEDULE_EVENTS_ARCHIVED)
  if (archived === null) {
    archived = false
  }

  let queryVars = {
    archived: (archived === "true") ? true : false,
    orderBy: (archived === "true") ? "-date_start": "date_start",
  }

  console.log(queryVars)

  return queryVars
}
