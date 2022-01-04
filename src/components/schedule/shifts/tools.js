import React from "react"
import CSLS from "../../../tools/cs_local_storage"

import StatusIcon from "../../ui/StatusIcon"


export function get_list_query_variables() {
  let orderBy
  let organizationShift
  let organizationLocation

  let queryVars = {
    dateFrom: localStorage.getItem(CSLS.SCHEDULE_SHIFTS_DATE_FROM), 
    dateUntil: localStorage.getItem(CSLS.SCHEDULE_SHIFTS_DATE_UNTIL)
  }

  orderBy = localStorage.getItem(CSLS.SCHEDULE_SHIFTS_ORDER_BY)
  if (orderBy) {
    queryVars.orderBy = orderBy
  }

  organizationShift = localStorage.getItem(CSLS.SCHEDULE_SHIFTS_FILTER_SHIFT)
  if (organizationShift) {
    queryVars.organizationShift = organizationShift
  } else {
    queryVars.organizationShift = ""
  }

  organizationLocation = localStorage.getItem(CSLS.SCHEDULE_SHIFTS_FILTER_LOCATION)
  if (organizationLocation) {
    queryVars.organizationLocation = organizationLocation
  } else {
    queryVars.organizationLocation = ""
  }

  console.log(queryVars)

  return queryVars
}


export function represent_teacher(name, role) {
  let textColor = false

  switch (role) {
    case "SUB":
      textColor = "text-blue"
      break
    case "ASSISTANT":
      textColor = "text-green"
      break
    case "KARMA":
      textColor = "text-orange"
      break
  }

  if (textColor) {
    return <span className={textColor}>{name}</span>
  } else {
    return name
  }
}


export function represent_shift_status(status) {
  let color

  switch (status) {
    case "SUB":
      color = "primary"
      break
    case "CANCELLED":
      color = "warning"
      break
    case "OPEN":
      color = "danger"
      break
    default:
      color = "success"
  }

  return <StatusIcon color={color} />
}


export function get_class_messages(t, status, description, holiday, holidayName) {
  let messages
  if (holiday) {
    return <span>{t("general.holiday")} ({holidayName})</span>
  }

  if (status == 'CANCELED') {
    return description
  }
}