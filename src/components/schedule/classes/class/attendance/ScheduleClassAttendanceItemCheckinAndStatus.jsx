import React from 'react'
import { useMutation } from '@apollo/client'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Button,
  Dropdown,
} from "tabler-react";
import HasPermissionWrapper from "../../../../HasPermissionWrapper"
import { toast } from 'react-toastify'
import { get_attendance_list_query_variables } from "./tools"

import { 
  GET_SCHEDULE_CLASS_ATTENDANCE_QUERY, 
  UPDATE_SCHEDULE_ITEM_ATTENDANCE,
} from "./queries"


function setAttendanceStatus({t, match, updateAttendance, node, status, setAttendanceRefetching=f=>f}) {
  const schedule_item_id = match.params.class_id
  const class_date = match.params.date

  setAttendanceRefetching(true)

  updateAttendance({
    variables: { 
      input: {
        id: node.id, 
        bookingStatus: status
      }
    },
    refetchQueries: [
      {query: GET_SCHEDULE_CLASS_ATTENDANCE_QUERY, 
        variables: get_attendance_list_query_variables(schedule_item_id, class_date)}
    ], 
    // Mutation is "complete" when refetchQueries finish
    awaitRefetchQueries: true
  }).then(({ data }) => {
    console.log('got data', data);
    // sleepFor(1000)
    setAttendanceRefetching(false)
    toast.success(
      t('schedule.classes.class.attendance.status_saved'), {
        position: toast.POSITION.BOTTOM_RIGHT
      })
  }).catch((error) => {
    setAttendanceRefetching(false)
    toast.error((t('general.toast_server_error')) +  error, {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    console.log('there was an error sending the query', error);
  })
}


function ScheduleClassAttendanceItemCheckinAndStatus({ 
  t, 
  match, 
  location, 
  scheduleItemAttendanceNode,
  setAttendanceRefetching=f=>f,
 }) {
  const [ updateAttendance ] = useMutation(UPDATE_SCHEDULE_ITEM_ATTENDANCE)

  return (
    <React.Fragment>
      {/* Status dropdown */}
      <Dropdown
        key={v4()}
        className="float-right"
        type="button"
        toggle
        color="secondary btn-sm"
        triggerContent={t("general.status")}
        items={[
          <HasPermissionWrapper key={v4()} permission="change" resource="scheduleitemattendance">
            <Dropdown.Item
              key={v4()}
              icon="calendar"
              onClick={() => {
                setAttendanceStatus({
                  t: t, 
                  match: match,
                  updateAttendance: updateAttendance,
                  node: scheduleItemAttendanceNode,
                  status: 'BOOKED',
                  setAttendanceRefetching: setAttendanceRefetching
                })
              }}>
                {t('schedule.classes.class.attendance.booking_status.BOOKED')}
            </Dropdown.Item>
          </HasPermissionWrapper>,
          <HasPermissionWrapper key={v4()} permission="change" resource="scheduleitemattendance">
            <Dropdown.Item
              key={v4()}
              icon="x"
              onClick={() => {
                setAttendanceStatus({
                  t: t, 
                  match: match,
                  updateAttendance: updateAttendance,
                  node: scheduleItemAttendanceNode,
                  status: 'CANCELLED',
                  setAttendanceRefetching: setAttendanceRefetching
                })
              }}>
                {t('schedule.classes.class.attendance.booking_status.CANCELLED')}
            </Dropdown.Item>
          </HasPermissionWrapper>,
        ]}
      />
      {/* Check-in button */}
      {(scheduleItemAttendanceNode.bookingStatus === "BOOKED") ?
        <HasPermissionWrapper key={v4()} permission="change" resource="scheduleitemattendance">
          <Button
            key={v4()}
            className="float-right"
            color="success"
            size="sm"
            onClick={() => {
              setAttendanceStatus({
                t: t, 
                match: match,
                updateAttendance: updateAttendance,
                node: scheduleItemAttendanceNode,
                status: 'ATTENDING',
                setAttendanceRefetching: setAttendanceRefetching
              })
            }}>
              {t('general.checkin')}
          </Button>
        </HasPermissionWrapper>  : "" }
    </React.Fragment>
  )
}


export default withTranslation()(withRouter(ScheduleClassAttendanceItemCheckinAndStatus))
