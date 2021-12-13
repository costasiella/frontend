import CSLS from "../../../tools/cs_local_storage"
import { dateToLocalISO, getFirstDayMonth, getLastDayMonth } from '../../../tools/date_tools'

export function getListQueryVariables() {
  let dateStartFrom = dateToLocalISO(getFirstDayMonth(
    localStorage.getItem(CSLS.INSIGHT_TRIALPASSES_YEAR),
    localStorage.getItem(CSLS.INSIGHT_TRIALPASSES_MONTH)
  ))
  let dateStartUntil = dateToLocalISO(getLastDayMonth(
    localStorage.getItem(CSLS.INSIGHT_TRIALPASSES_YEAR),
    localStorage.getItem(CSLS.INSIGHT_TRIALPASSES_MONTH)
  ))

  return {
    dateStartFrom: dateStartFrom,
    dateStartUntil: dateStartUntil
  }
}