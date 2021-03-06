import CSLS from "../../../tools/cs_local_storage"

export function get_list_query_variables() {
  let isActive = localStorage.getItem(CSLS.RELATIONS_ACCOUNTS_IS_ACTIVE)
  if (isActive === null) {
    isActive = true
  }

  let queryVars = {
    isActive: (isActive === "true") ? true : false,
    customer: undefined,
    instructor: undefined,
    employee: undefined,
    orderBy: "-createdAt"
  }

  let search = localStorage.getItem(CSLS.RELATIONS_ACCOUNTS_SEARCH)
  queryVars.searchName = search

  if (search) {
    queryVars.orderBy = "fullName"
  }

  let type_filter = localStorage.getItem(CSLS.RELATIONS_ACCOUNTS_FILTER_TYPE)
  switch (type_filter) {
    case "customer":
      queryVars.customer = true
      break
    case "instructor":
      queryVars.instructor = true
      break
    case "employee":
      queryVars.employee = true
      break
    default:
      break
  }

  return queryVars
}

