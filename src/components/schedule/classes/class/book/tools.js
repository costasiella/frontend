import CSLS from "../../../../../tools/cs_local_storage"

export function getUrlFromReturnTo() {
  // let returnUrl

  return localStorage.getItem(CSLS.SCHEDULE_CLASSES_BOOK_RETURN)

  // if (returnTo === "schedule_classes") {
  //   returnUrl = '/schedule/classes/class/attendance/' + schedule_item_id + "/" + class_date
  // } else if (returnTo === "selfcheckin") {
  //   returnUrl = '/selfcheckin/checkin/' + locationId + "/" + schedule_item_id + "/" + class_date
  // }
  
  // return returnUrl
}