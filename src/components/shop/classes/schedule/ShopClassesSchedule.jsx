import React, { useContext } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { useQuery } from '@apollo/client'
import { v4 } from 'uuid'
import moment from 'moment'

import CSLS from "../../../../tools/cs_local_storage"
import AppSettingsContext from '../../../context/AppSettingsContext'

import {
  Button,
  Card, 
  Dimmer,
  Grid,
  Icon,
  Progress,
  Table,
} from "tabler-react";
import ShopClassesScheduleBase from "./ShopClassesScheduleBase"
import ShopClassesScheduleFilter from "./ShopClassesScheduleFilter"
import ShopClassesScheduleButtonBook from "./ShopClassesScheduleButtonBook"

import { GET_CLASSES_QUERY } from "../../../schedule/classes/queries"
import { get_list_query_variables } from './tools'


function capitalize(word) {
  const lower = word.toLowerCase();
  return word.charAt(0).toUpperCase() + lower.slice(1);
}


// Set some initial values for dates, if not found
if (!localStorage.getItem(CSLS.SHOP_CLASSES_DATE_FROM)) {
  console.log('date from not found... defaulting to today...')
  localStorage.setItem(CSLS.SHOP_CLASSES_DATE_FROM, moment().format('YYYY-MM-DD')) 
  localStorage.setItem(CSLS.SHOP_CLASSES_DATE_UNTIL, moment().add(6, 'days').format('YYYY-MM-DD')) 
} else {
  const date_from  = moment(localStorage.getItem(CSLS.SHOP_CLASSES_DATE_FROM))
  if (date_from.isBefore(moment(), "day")) {
    localStorage.setItem(CSLS.SHOP_CLASSES_DATE_FROM, moment().format('YYYY-MM-DD')) 
    localStorage.setItem(CSLS.SHOP_CLASSES_DATE_UNTIL, moment().add(6, 'days').format('YYYY-MM-DD')) 
  }
}


function ShopClassesSchedule({ t, match, history }) {
  const appSettings = useContext(AppSettingsContext)
  const timeFormat = appSettings.timeFormatMoment

  const title = t("shop.home.title")
  const { loading, error, data, refetch } = useQuery(GET_CLASSES_QUERY, {
    variables: get_list_query_variables(),
    // https://github.com/apollographql/react-apollo/issues/321
    // Set loading to true when refetching
    notifyOnNetworkStatusChange: true
  })

  console.log(loading)

  const pageHeaderOptions = <Button.List className="schedule-list-page-options-btn-list">
    <Button 
      icon="chevron-left"
      color="secondary"
      disabled={ (moment(localStorage.getItem(CSLS.SHOP_CLASSES_DATE_FROM)).subtract(7, 'days').isBefore(moment(), "day")) }
      onClick={ () => {
        let prevWeekFrom = moment(localStorage.getItem(CSLS.SHOP_CLASSES_DATE_FROM)).subtract(7, 'days')
        let prevWeekUntil = moment(prevWeekFrom).add(6, 'days')
        
        localStorage.setItem(CSLS.SHOP_CLASSES_DATE_FROM, prevWeekFrom.format('YYYY-MM-DD')) 
        localStorage.setItem(CSLS.SHOP_CLASSES_DATE_UNTIL, prevWeekUntil.format('YYYY-MM-DD')) 

        refetch(get_list_query_variables())
    }} />
    <Button 
      color="secondary"
      onClick={ () => {
        let currentWeekFrom = moment()
        let currentWeekUntil = moment(currentWeekFrom).add(6, 'days')

        localStorage.setItem(CSLS.SHOP_CLASSES_DATE_FROM, currentWeekFrom.format('YYYY-MM-DD')) 
        localStorage.setItem(CSLS.SHOP_CLASSES_DATE_UNTIL, currentWeekUntil.format('YYYY-MM-DD')) 
        
        refetch(get_list_query_variables())
    }} > 
      {t("general.today")}
    </Button>
    <Button 
      icon="chevron-right"
      color="secondary"
      onClick={ () => {
        let nextWeekFrom = moment(localStorage.getItem(CSLS.SHOP_CLASSES_DATE_FROM)).add(7, 'days')
        let nextWeekUntil = moment(nextWeekFrom).add(6, 'days')
        
        localStorage.setItem(CSLS.SHOP_CLASSES_DATE_FROM, nextWeekFrom.format('YYYY-MM-DD')) 
        localStorage.setItem(CSLS.SHOP_CLASSES_DATE_UNTIL, nextWeekUntil.format('YYYY-MM-DD')) 

        refetch(get_list_query_variables())
    }} />
  </Button.List>

  if (loading) return (
    <ShopClassesScheduleBase title={title} pageHeaderOptions={pageHeaderOptions} >
      <br /><br /><br /><br />    
      <Dimmer active={true} loader={true} />
    </ShopClassesScheduleBase>
  )
  if (error) return (
    <ShopClassesScheduleBase title={title} pageHeaderOptions={pageHeaderOptions}>
      {t("shop.classes.error_loading")}
    </ShopClassesScheduleBase>
  )

  console.log(data)
  console.log(data.scheduleClasses)
  

  return (
    <ShopClassesScheduleBase 
      title={title}
      pageHeaderOptions={pageHeaderOptions}
    >
      <ShopClassesScheduleFilter data={data} refetch={refetch} />
      {data.scheduleClasses.map(({ date, bookingOpenOn, classes }) =>
        <Grid.Row key={v4()}>
          <Grid.Col md={12}>
              <Card>
                <Card.Header>
                  <Card.Title>
                    <b>{capitalize(moment(date).format("dddd"))}</b> {' '}
                    <span className="text-muted">
                      {moment(date).format("LL")} 
                    </span>
                  </Card.Title>
                </Card.Header>                
                {!(classes.length) ? 
                  <Card.Body>
                    <p>{t('schedule.classes.empty_list')}</p>
                  </Card.Body> :
                  <Table cards>
                    <Table.Body>
                      {classes.map(({ 
                        scheduleItemId, 
                        frequencyType,
                        date, 
                        status,
                        holiday,
                        holidayName,
                        description,
                        account, 
                        role,
                        account2,
                        role2,
                        organizationLocationRoom, 
                        organizationClasstype, 
                        organizationLevel,
                        timeStart, 
                        timeEnd,
                        spaces,
                        availableSpacesOnline,
                        displayPublic,
                        bookingStatus }) => (
                          <Table.Row>
                            <Table.Col>
                            <h4>
                              {moment(date + ' ' + timeStart).format(timeFormat)} {' - '}
                              {moment(date + ' ' + timeEnd).format(timeFormat)} { ' ' }
                            </h4> 
                            { organizationClasstype.name } { (account) ? ' ' + t("general.with") + ' ' + account.fullName : "" } <br />
                            <span className="text-muted">{ organizationLocationRoom.organizationLocation.name }</span>
                            </Table.Col>
                            <Table.Col>
                              <ShopClassesScheduleButtonBook
                                scheduleItemId={scheduleItemId}
                                classDate={date}
                                bookingOpenOn={bookingOpenOn}
                                bookingStatus={bookingStatus}
                              />
                              {(bookingStatus !== "FINISHED" && status !== "CANCELLED") ? 
                                <React.Fragment>
                                <div style={{clear: "both"}} />
                                <div className="cs-shop-classes-schedule-business-indicator mt-2">
                                <div className="float-right"><small><Icon name="users" className="text-muted" /></small></div>
                                  <Progress size="xs" className="cs-shop-classes-schedule-business-indicator">
                                    {/* This strange calculation shows online spaces in the progress bar, not all spaces. */}
                                    <Progress.Bar color="primary" width={((spaces-availableSpacesOnline)/spaces) * 100} /> 
                                  </Progress>
                                </div>
                                </React.Fragment>
                                : ""
                              }
                            </Table.Col>
                          </Table.Row>
                        )
                      )}
                    </Table.Body>
                  </Table>
                }
              </Card>
          </Grid.Col>
        </Grid.Row>
      )}
    </ShopClassesScheduleBase>
  )
}


export default withTranslation()(withRouter(ShopClassesSchedule))
