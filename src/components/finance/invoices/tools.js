import CSLS from "../../../tools/cs_local_storage"

export function get_list_query_variables() {
  let queryVars = {}

  let status = localStorage.getItem(CSLS.FINANCE_INVOICES_FILTER_STATUS)
  if (status) {
    queryVars.status = status
  } else {
    queryVars.status = undefined
  }

  let search = localStorage.getItem(CSLS.FINANCE_INVOICES_FILTER_SEARCH)
  if (search) {
    queryVars.invoiceNumberSearch = search
  } else {
    queryVars.invoiceNumberSearch = undefined
  }

  // Date from
  let dateFrom = localStorage.getItem(CSLS.FINANCE_INVOICES_FILTER_DATE_FROM)
  if (dateFrom) {
    queryVars.dateFrom = dateFrom
  } else {
    queryVars.dateFrom = undefined
  }

  // Date until
  let dateUntil = localStorage.getItem(CSLS.FINANCE_INVOICES_FILTER_DATE_UNTIL)
  if (dateUntil) {
    queryVars.dateUntil = dateUntil
  } else {
    queryVars.dateUntil = undefined
  }
  
  console.log(queryVars)

  return queryVars
}
