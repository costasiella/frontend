import React from 'react'
import { useQuery } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import {
    Alert,
    Dropdown,
    Page,
    Grid,
    Icon,
    Dimmer,
    Badge,
    Button,
    Card,
    Container,
    Table
  } from "tabler-react";

import { TimeStringToJSDateOBJ } from '../../../../../tools/date_tools'
import { class_subtitle } from "../tools"
import ScheduleClassEditBase from '../ScheduleClassEditBase'


import { GET_CLASS_ATTENDANCE_COUNT_YEAR } from "./queries"


function ScheduleClassAttendanceChart({t, history, match}) {
  const classDate = match.params.date
  const scheduleItemId = match.params.class_id
  const menuActiveLink = "attendancechart"

  const year = classDate.substring(0, 3)
  console.log(year)

  const { loading, error, data } = useQuery(GET_CLASS_ATTENDANCE_COUNT_YEAR, {
    variables: {
      year: year,
      scheduleItem: scheduleItemId
    }
  })

  if (loading) {
    return (
      <ScheduleClassEditBase menuActiveLink={menuActiveLink}>
          {t('general.loading_with_dots')}
      </ScheduleClassEditBase>
    )
  }

  if (error) {
    return (
      <ScheduleClassEditBase menuActiveLink={menuActiveLink}>
          {t('general.error_sad_smiley')}
      </ScheduleClassEditBase>
    )
  }

  
  const scheduleItem = data.scheduleItem
  
  const subTitle = class_subtitle({
    t: t,
    location: scheduleItem.organizationLocationRoom.organizationLocation.name, 
    locationRoom: scheduleItem.organizationLocationRoom.name,
    classtype: scheduleItem.organizationClasstype.name, 
    timeStart: TimeStringToJSDateOBJ(scheduleItem.timeStart), 
    date: classDate
  })

  return (
    <ScheduleClassEditBase menuActiveLink={menuActiveLink} subTitle={subTitle}>
      hello world
    </ScheduleClassEditBase>
  )
}

export default withTranslation()(withRouter(ScheduleClassAttendanceChart))