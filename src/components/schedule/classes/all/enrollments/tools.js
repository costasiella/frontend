export function getAccountsQueryVariables(searchName) {
  let queryVars = {
    instructor: undefined,
    employee: undefined,
    searchName: undefined
  }

  if (searchName) {
    queryVars.searchName = searchName
  }

  return queryVars
}

export function getEnrollmentsListQueryVariables(scheduleItemId, showEnded=false) {
  let queryVars = {
    scheduleItem: scheduleItemId,
    dateEnd_Isnull: true
  }

  if (showEnded) {
    queryVars.dateEnd_Isnull = false
  } 

  return queryVars
}
