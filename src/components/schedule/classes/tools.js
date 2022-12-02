import React from "react"
import CSLS from "../../../tools/cs_local_storage"
import {
  Badge,
  Icon
} from "tabler-react";

import StatusIcon from "../../ui/StatusIcon"
import { t } from "i18next";


export function get_list_query_variables() {
  let orderBy
  let organizationClasstype
  let instructor
  let organizationLevel
  let organizationLocation

  let queryVars = {
    dateFrom: localStorage.getItem(CSLS.SCHEDULE_CLASSES_DATE_FROM), 
    dateUntil: localStorage.getItem(CSLS.SCHEDULE_CLASSES_DATE_UNTIL)
  }

  orderBy = localStorage.getItem(CSLS.SCHEDULE_CLASSES_ORDER_BY)
  if (orderBy) {
    queryVars.orderBy = orderBy
  }

  organizationClasstype = localStorage.getItem(CSLS.SCHEDULE_CLASSES_FILTER_CLASSTYPE)
  if (organizationClasstype) {
    queryVars.organizationClasstype = organizationClasstype
  } else {
    queryVars.organizationClasstype = ""
  }

  instructor = localStorage.getItem(CSLS.SCHEDULE_CLASSES_FILTER_INSTRUCTOR)
  if (instructor) {
    queryVars.instructor = instructor
  } else {
    queryVars.instructor = ""
  }

  organizationLevel = localStorage.getItem(CSLS.SCHEDULE_CLASSES_FILTER_LEVEL)
  if (organizationLevel) {
    queryVars.organizationLevel = organizationLevel
  } else {
    queryVars.organizationLevel = ""
  }

  organizationLocation = localStorage.getItem(CSLS.SCHEDULE_CLASSES_FILTER_LOCATION)
  if (organizationLocation) {
    queryVars.organizationLocation = organizationLocation
  } else {
    queryVars.organizationLocation = ""
  }

  console.log(queryVars)

  return queryVars
}


export function represent_instructor(name, role) {
  let badge

  switch (role) {
    case "SUB":
      badge = <Badge color="primary">{t("schedule.classes.instructor_roles.sub")}</Badge>
      break
    case "ASSISTANT":
      badge = <Badge color="success">{t("schedule.classes.instructor_roles.assistant")}</Badge>
      break
    case "KARMA":
      badge = <Badge color="warning">{t("schedule.classes.instructor_roles.karma")}</Badge>
      break
    default:
      break
  }

  return <React.Fragment><Icon name="user"/> {name} {badge}</React.Fragment>
}


export function represent_class_status(status) {
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
  if (holiday) {
    return <span>{t("general.holiday")} ({holidayName})</span>
  }

  if (status === 'CANCELLED') {
    return description
  }
}