export function getUrlFromReturnTo({returnTo, schedule_item_id, class_date, locationId}) {
  let returnUrl

  if (returnTo === "schedule_classes") {
    returnUrl = '/schedule/classes/class/attendance/' + schedule_item_id + "/" + class_date
  } else if (returnTo === "selfcheckin") {
    returnUrl = '/selfcheckin/checkin/' + locationId + "/" + schedule_item_id + "/" + class_date
  }
  
  return returnUrl
}