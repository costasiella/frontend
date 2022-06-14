import React from 'react'
import { useQuery } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'

import {
    colors,
    Card,
  } from "tabler-react";

import { TimeStringToJSDateOBJ } from '../../../../../tools/date_tools'
import { class_subtitle } from "../tools"
import ScheduleClassEditBase from '../ScheduleClassEditBase'


import { GET_CLASS_ATTENDANCE_COUNT_YEAR } from "./queries"


function ScheduleClassAttendanceChart({t, history, match}) {
  const classDate = match.params.date
  const scheduleItemId = match.params.class_id
  const menuActiveLink = "attendancechart"
  const year = parseInt(classDate.substring(0, 4))

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

  // Add month name to data
  const chartData = data.insightClassAttendanceCountYear.weeks.map((item, index) => (
    { ...item, weekName: `${t("general.week")} ${item.week}` }
  ))

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
      <Card title={t('schedule.classes.class.attendance_chart.title')}>
        <ResponsiveContainer width="100%" aspect={2.6}>
          <BarChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 10,
              right: 20,
              left: 0,
              bottom: 10,
            }}
          >
            <XAxis dataKey="weekName" interval={4} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="attendanceCountCurrentYear" name={year} fill={colors['azure']} />
            <Bar dataKey="attendanceCountPreviousYear" name={year-1} fill={colors['azure-lighter']} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </ScheduleClassEditBase>
  )
}

export default withTranslation()(withRouter(ScheduleClassAttendanceChart))