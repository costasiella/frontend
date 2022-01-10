// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import {
  Page,
  Grid,
  Icon,
  Button,
  Container,
} from "tabler-react";
import SiteWrapper from "../../SiteWrapper"
import HasPermissionWrapper from "../../HasPermissionWrapper"
import CSDatePicker from "../../ui/CSDatePicker"

import CSLS from "../../../tools/cs_local_storage"

import ScheduleShiftsFilter from "./ScheduleShiftsFilter"

import { 
  get_list_query_variables, 
} from './tools'

import moment from 'moment'

// Set some initial values for dates, if not found
if (!localStorage.getItem(CSLS.SCHEDULE_SHIFTS_DATE_FROM)) {
  console.log('date from not found... defaulting to today...')
  localStorage.setItem(CSLS.SCHEDULE_SHIFTS_DATE_FROM, moment().format('YYYY-MM-DD')) 
  localStorage.setItem(CSLS.SCHEDULE_SHIFTS_DATE_UNTIL, moment().add(6, 'days').format('YYYY-MM-DD')) 
} 


function ScheduleShiftsBase ({ t, history, children, data, refetch }) {
  
  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t("schedule.title")} subTitle={t("schedule.shifts.title")}>
            <div className="page-options d-flex">
              <span title={t("schedule.classes.tooltip_sort_by_location")}>
                <Button 
                  icon="home"
                  tooltip="text"
                  className="mr-2"
                  color={
                    ((localStorage.getItem(CSLS.SCHEDULE_SHIFTS_ORDER_BY) === "location") || (!localStorage.getItem(CSLS.SCHEDULE_SHIFTS_ORDER_BY))) ?
                    "azure" : "secondary"
                  }
                  onClick={() => {
                    localStorage.setItem(CSLS.SCHEDULE_SHIFTS_ORDER_BY, "location")
                    refetch(get_list_query_variables())
                  }}
                />
              </span>
              <span title={t("schedule.classes.tooltip_sort_by_starttime")}>
                <Button 
                  icon="clock"
                  className="mr-2"
                  color={
                    (localStorage.getItem(CSLS.SCHEDULE_SHIFTS_ORDER_BY) === "starttime") ?
                    "azure" : "secondary"
                  }
                  onClick={() => {
                    localStorage.setItem(CSLS.SCHEDULE_SHIFTS_ORDER_BY, "starttime")
                    refetch(get_list_query_variables())
                  }}
                />
              </span>
              <CSDatePicker 
                className="form-control schedule-list-csdatepicker mr-2"
                selected={new Date(localStorage.getItem(CSLS.SCHEDULE_SHIFTS_DATE_FROM))}
                isClearable={false}
                onChange={(date) => {
                  let nextWeekFrom = moment(date)
                  let nextWeekUntil = moment(nextWeekFrom).add(6, 'days')

                  localStorage.setItem(CSLS.SCHEDULE_SHIFTS_DATE_FROM, nextWeekFrom.format('YYYY-MM-DD')) 
                  localStorage.setItem(CSLS.SCHEDULE_SHIFTS_DATE_UNTIL, nextWeekUntil.format('YYYY-MM-DD')) 

                  console.log(get_list_query_variables())

                  refetch(get_list_query_variables())
                }}
                placeholderText={t('schedule.classes.go_to_date')}
              />
              <Button.List className="schedule-list-page-options-btn-list">
                <Button 
                  icon="chevron-left"
                  color="secondary"
                  onClick={ () => {
                    let nextWeekFrom = moment(localStorage.getItem(CSLS.SCHEDULE_SHIFTS_DATE_FROM)).subtract(7, 'days')
                    let nextWeekUntil = moment(nextWeekFrom).add(6, 'days')
                    
                    localStorage.setItem(CSLS.SCHEDULE_SHIFTS_DATE_FROM, nextWeekFrom.format('YYYY-MM-DD')) 
                    localStorage.setItem(CSLS.SCHEDULE_SHIFTS_DATE_UNTIL, nextWeekUntil.format('YYYY-MM-DD')) 

                    refetch(get_list_query_variables())
                }} />
                <Button 
                  icon="sunset"
                  color="secondary"
                  onClick={ () => {
                    let currentWeekFrom = moment()
                    let currentWeekUntil = moment(currentWeekFrom).add(6, 'days')

                    localStorage.setItem(CSLS.SCHEDULE_SHIFTS_DATE_FROM, currentWeekFrom.format('YYYY-MM-DD')) 
                    localStorage.setItem(CSLS.SCHEDULE_SHIFTS_DATE_UNTIL, currentWeekUntil.format('YYYY-MM-DD')) 
                    
                    refetch(get_list_query_variables())
                }} />
                <Button 
                  icon="chevron-right"
                  color="secondary"
                  onClick={ () => {
                    let nextWeekFrom = moment(localStorage.getItem(CSLS.SCHEDULE_SHIFTS_DATE_FROM)).add(7, 'days')
                    let nextWeekUntil = moment(nextWeekFrom).add(6, 'days')
                    
                    localStorage.setItem(CSLS.SCHEDULE_SHIFTS_DATE_FROM, nextWeekFrom.format('YYYY-MM-DD')) 
                    localStorage.setItem(CSLS.SCHEDULE_SHIFTS_DATE_UNTIL, nextWeekUntil.format('YYYY-MM-DD')) 

                    refetch(get_list_query_variables())
                }} />
              </Button.List> 
              <HasPermissionWrapper permission="add"
                                    resource="scheduleshift">
                <Link to={"/schedule/shifts/add"}>
                  <Button color="primary btn-block ml-2">
                    <Icon prefix="fe" name="plus-circle" /> {t('general.add')}
                  </Button>
                </Link>
              </HasPermissionWrapper>
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={9}>
              {children}
            </Grid.Col>
            <Grid.Col md={3}>
              {(data) ? 
                <ScheduleShiftsFilter data={data} refetch={refetch} />
              : ""}
          </Grid.Col>
        </Grid.Row>
      </Container>
      </div>
    </SiteWrapper>
  )
}

export default withTranslation()(withRouter(ScheduleShiftsBase))