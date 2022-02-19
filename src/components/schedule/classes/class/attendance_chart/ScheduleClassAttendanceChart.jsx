import React from 'react'
import { useQuery } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import C3Chart from "react-c3js"

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

  const dataLabelCurrentYear = year
  const chartDataCurrentYear = data.insightClassAttendanceCountYear.dataCurrent
  const dataLabelPreviousYear = year - 1
  const chartDataPreviousYear = data.insightClassAttendanceCountYear.dataPrevious
  const scheduleItem = data.scheduleItem
  
  const subTitle = class_subtitle({
    t: t,
    location: scheduleItem.organizationLocationRoom.organizationLocation.name, 
    locationRoom: scheduleItem.organizationLocationRoom.name,
    classtype: scheduleItem.organizationClasstype.name, 
    timeStart: TimeStringToJSDateOBJ(scheduleItem.timeStart), 
    date: classDate
  })

  function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
  }

  return (
    <ScheduleClassEditBase menuActiveLink={menuActiveLink} subTitle={subTitle}>
      <Card title={t('schedule.classes.class.attendance_chart.title')}>
        <Card.Body>
          <C3Chart
            style={{ height: "16rem" }}
            data={{
              x: 'x',
              columns: [
                // each columns data as array, starting with "name" and then containing data
                [ 'x',
                  ...range(54, 1) // This adds 1 .. 53
                ],
                [ 'current', ...chartDataCurrentYear],
                [ 'previous', ...chartDataPreviousYear],
              ],
              type: "bar", // default type of chart
              groups: [['current'], ['previous']],
              colors: {
                current: colors["azure"],
                previous: colors["azure-lighter"],
              },
              names: {
                // name of each serie
                current: dataLabelCurrentYear,
                previous: dataLabelPreviousYear
              },
              
            }}
            axis={{
              y: {
                padding: {
                  bottom: 0,
                },
                show: true,
                // Don't show decimals on ticks, only whole numbers
                tick: {
                  format: function (d) {
                      return (parseInt(d) === d) ? d : null;
                  }
                }
              },
              x: {
                padding: {
                  left: 0,
                  right: 0,
                },
                type: 'category',
                show: true,
              },
            }}
            tooltip={{
              format: {
                title: function(x) {
                  return "";
                },
              },
            }}
            padding={{
              bottom: 0,
              // left: -1,
              right: -1,
            }}
            point={{
              show: false,
            }}
          />
        </Card.Body>
        <Card.Footer>
          {/* {t("insight.revenue.total.explanation")} */}
        </Card.Footer>
      </Card>
    </ScheduleClassEditBase>
  )
}

export default withTranslation()(withRouter(ScheduleClassAttendanceChart))