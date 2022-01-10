import React from 'react'
import { useMutation } from '@apollo/client';
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import { GET_SHIFTS_QUERY } from '../../queries'
import { get_list_query_variables } from '../../tools'
import { DELETE_SCHEDULE_ITEM_WEEKLY_OTC, GET_SCHEDULE_SHIFT_WEEKLY_OTCS_QUERY } from "./queries"
import confirm_delete from "../../../../../tools/confirm_delete"

import {
  Icon
} from "tabler-react"


function ScheduleItemWeeklyOTCDelete({t, match, history}) {
  const scheduleItemId = match.params.shift_id
  const shiftDate = match.params.date
  const [deleteScheduleShiftOTC] = useMutation(DELETE_SCHEDULE_ITEM_WEEKLY_OTC, {
    onCompleted: () => { history.push("/schedule/shifts/") }
  })
  const query_vars = {
    scheduleItem: scheduleItemId,
    date: shiftDate
  }

  return (
    <button className="icon btn-block btn btn-danger mb-3" 
      title={t('general.delete')} 
      href=""
      onClick={() => {
        confirm_delete({
          t: t,
          msgConfirm: t("schedule.shifts.shift.edit.delete_confirm_msg"),
          msgDescription: <p></p>,
          msgSuccess: t('schedule.shifts.shift.edit.delete_success'),
          deleteFunction: deleteScheduleShiftOTC,
          functionVariables: { 
            variables: {
              input: {
                scheduleItem: scheduleItemId,
                date: shiftDate
              },
            }, 
            refetchQueries: [
              { query: GET_SCHEDULE_SHIFT_WEEKLY_OTCS_QUERY, variables: query_vars },
              { query: GET_SHIFTS_QUERY, variables: get_list_query_variables() },
            ]
          }
        })
    }}>
      <span className="text-white"><Icon prefix="fe" name="trash-2" /> {" "} {t("schedule.shifts.shift.edit.delete_all_changes")}</span>
    </button>
  )
}


export default withTranslation()(withRouter(ScheduleItemWeeklyOTCDelete))
