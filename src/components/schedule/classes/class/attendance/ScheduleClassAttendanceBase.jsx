import React from 'react'
import { useQuery } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Dimmer,
} from "tabler-react";

import { TimeStringToJSDateOBJ } from '../../../../../tools/date_tools'
import ScheduleClassAttendanceBaseBase from './ScheduleClassAttendanceBaseBase'
import { class_subtitle } from "../tools"
import ContentCard from "../../../../general/ContentCard"
import { GET_SCHEDULE_CLASS_QUERY } from "./queries"


function ScheduleClassAttendanceBase({ t, match, history, children, refetch }) {
  const schedule_item_id = match.params.class_id
  const class_date = match.params.date
  const cardTitle=t('general.attendance')
  const { loading, error, data } = useQuery(
    GET_SCHEDULE_CLASS_QUERY, {
      variables: { scheduleItem: schedule_item_id, date: class_date }
    }
  )

  if (loading) return (
    <ScheduleClassAttendanceBaseBase refetch={refetch}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </ScheduleClassAttendanceBaseBase>
  )

  if (error) return (
    <ScheduleClassAttendanceBaseBase refetch={refetch}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('schedule.classes.class.attendance.error_loading')}</p>
      </ContentCard>
    </ScheduleClassAttendanceBaseBase>
  )

  const scheduleClass = data.scheduleClass

  const pageSubTitle = class_subtitle({
    t: t,
    location: scheduleClass.organizationLocationRoom.organizationLocation.name, 
    locationRoom: scheduleClass.organizationLocationRoom.name,
    classtype: scheduleClass.organizationClasstype.name, 
    timeStart: TimeStringToJSDateOBJ(scheduleClass.timeStart), 
    date: class_date
  })
  
  console.log(scheduleClass.status)
  
  return (
    <ScheduleClassAttendanceBaseBase pageSubTitle={pageSubTitle}  refetch={refetch}>
      {children}
    </ScheduleClassAttendanceBaseBase>

  )
}


export default withTranslation()(withRouter(ScheduleClassAttendanceBase))
