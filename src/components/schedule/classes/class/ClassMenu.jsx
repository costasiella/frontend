import React from 'react'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'


import {
  List
} from "tabler-react";
import HasPermissionWrapper from "../../../HasPermissionWrapper"


function ClassMenu ({ t, scheduleItemId, classDate, activeLink }) {
  let attendance_active = false
  let attendancechart_active = false
  let edit_active = false

  switch (activeLink) {
    case "attendance":
      attendance_active = true
      break
    case "attendancechart":
      attendancechart_active = true
      break
    case "edit":
      edit_active = true
      break
    default:
      break
  }

  return (
    <div>
      <List.Group transparent={true}>   
        <HasPermissionWrapper 
            resource="scheduleitemattendance"
            permission="view" 
        >
          <List.GroupItem
              key={v4()}
              className="d-flex align-items-center"
              to={"#/schedule/classes/class/attendance/" + scheduleItemId + "/" + classDate}
              icon="check-circle"
              active={attendance_active}
              >
              {t("general.attendance")}
          </List.GroupItem>
        </HasPermissionWrapper>
        <HasPermissionWrapper 
            resource="scheduleitemattendance"
            permission="view" 
        >
          <List.GroupItem
              key={v4()}
              className="d-flex align-items-center"
              to={"#/schedule/classes/class/attendance_chart/" + scheduleItemId + "/" + classDate}
              icon="bar-chart-2"
              active={attendancechart_active}
              >
              {t("schedule.classes.class.attendance_chart.title")}
          </List.GroupItem>
        </HasPermissionWrapper>
        <HasPermissionWrapper 
            resource="scheduleitemweeklyotc"
            permission="change" 
        >
          <List.GroupItem
              key={v4()}
              className="d-flex align-items-center"
              to={"#/schedule/classes/class/edit/" + scheduleItemId + "/" + classDate}
              icon="edit-3"
              active={edit_active}
              >
              {t("schedule.classes.class.menu.edit_this_class")}
          </List.GroupItem>
        </HasPermissionWrapper>

      </List.Group>
    </div>
  )
}

export default withTranslation()(ClassMenu)