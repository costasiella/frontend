// @flow

import React, { useContext } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import AppSettingsContext from '../../context/AppSettingsContext'

import {
  Badge,
  Dropdown,
  Page,
  Grid,
  Icon,
  Dimmer,
  Button,
  Card,
  Container,
  Table,
  Text,
} from "tabler-react";
import SiteWrapper from "../../SiteWrapper"
import HasPermissionWrapper from "../../HasPermissionWrapper"
import CSDatePicker from "../../ui/CSDatePicker"
import confirm_delete from "../../../tools/confirm_delete"
import { confirmAlert } from 'react-confirm-alert'
import { toast } from 'react-toastify'

import CSLS from "../../../tools/cs_local_storage"


import BadgeBoolean from "../../ui/BadgeBoolean"
import ContentCard from "../../general/ContentCard"
import ScheduleShiftsFilter from "./ScheduleShiftsFilter"
import ScheduleShiftsBase from './ScheduleShiftsBase'

import { GET_SHIFTS_QUERY, DELETE_SCHEDULE_SHIFT } from "./queries"
import { 
  get_class_messages,
  get_list_query_variables, 
  represent_shift_status,
  represent_teacher 
} from './tools'

import moment from 'moment'


// Set some initial values for dates, if not found
if (!localStorage.getItem(CSLS.SCHEDULE_SHIFTS_DATE_FROM)) {
  console.log('date from not found... defaulting to today...')
  localStorage.setItem(CSLS.SCHEDULE_SHIFTS_DATE_FROM, moment().format('YYYY-MM-DD')) 
  localStorage.setItem(CSLS.SCHEDULE_SHIFTS_DATE_UNTIL, moment().add(6, 'days').format('YYYY-MM-DD')) 
} 


function ScheduleShifts ({ t, history }) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const timeFormat = appSettings.timeFormatMoment

  const {loading, error, data, refetch} = useQuery(GET_SHIFTS_QUERY, {
    variables: get_list_query_variables()
  })
  const [deleteScheduleShift] = useMutation(DELETE_SCHEDULE_SHIFT)

  if (loading) {
    return (
      <ScheduleShiftsBase>
        <p>{t('general.loading_with_dots')}</p>
      </ScheduleShiftsBase>
    )
  }

  if (error) {
    return (
      <ScheduleShiftsBase>
        <p>{t('general.error_sad_smiley')}</p>
      </ScheduleShiftsBase>
    )
  }

  const shifts = data.scheduleShifts
       
  // Empty list
  if (!shifts.length) { return (
    <ScheduleShiftsBase>
      <p>
        {t('schedule.shifts.empty_list')}
      </p>
    </ScheduleShiftsBase>
  )} 

  return (
    <ScheduleShiftsBase data={data} refetch={refetch}>
      { data.scheduleShifts.map(({ date, shifts }) => (
        <div key={v4()}>
          <Card>
            <Card.Header>
              <Card.Title>
                <b>{moment(date).format("dddd")}</b> {' '}
                <span className="text-muted">
                  {moment(date).format("LL")} 
                </span>
              </Card.Title>
            </Card.Header>
            {!(shifts.length) ? <Card.Body>{t('schedule.shifts.empty_list')}</Card.Body> :
              <Table cards>
                <Table.Header>
                  <Table.Row key={v4()}>
                    <Table.ColHeader /> 
                    <Table.ColHeader>{t('general.time')}</Table.ColHeader>
                    <Table.ColHeader>{t('general.location')}</Table.ColHeader>
                    <Table.ColHeader>{t('general.shift')}</Table.ColHeader>
                    <Table.ColHeader>{t('general.teacher')}</Table.ColHeader>
                    <Table.ColHeader></Table.ColHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {shifts.map((
                    { scheduleItemId, 
                      frequencyType,
                      date, 
                      status,
                      holiday,
                      holidayName,
                      description,
                      account, 
                      account2,
                      organizationLocationRoom, 
                      organizationShift, 
                      timeStart, 
                      timeEnd }) => (
                    <Table.Row key={v4()}>
                      <Table.Col>
                        {represent_shift_status(status)}
                      </Table.Col>
                      <Table.Col>
                        {/* Start & end time */}
                        {moment(date + ' ' + timeStart).format(timeFormat)} {' - '}
                        {moment(date + ' ' + timeEnd).format(timeFormat)} { ' ' }
                        {(frequencyType === 'SPECIFIC') ? <Badge color="primary">{t('general.once')}</Badge> : null } <br />
                        <small className="text-muted">{get_class_messages(t, status, description, holiday, holidayName)}</small>
                      </Table.Col>
                      <Table.Col>
                        {/* Location */}
                        {organizationLocationRoom.organizationLocation.name} <br />
                        <small className="text-muted">{organizationLocationRoom.name}</small>
                      </Table.Col>
                      <Table.Col>
                        {/* Shift and level */}
                        {organizationShift.name}
                      </Table.Col>
                      <Table.Col>
                        {/* Employee(s) */}
                        { (account) ? 
                            account.fullName : 
                            <span className="text-red">{t("schedule.shifts.no_employee")}</span>
                        } <br />
                        <small className="text-muted">
                          {(account2) ? account2.fullName : ""}
                        </small>
                      </Table.Col>
                      <Table.Col>
                        <Dropdown
                          key={v4()}
                          className="pull-right"
                          type="button"
                          toggle
                          color="secondary btn-sm"
                          triggerContent={t("general.actions")}
                          items={[
                            <HasPermissionWrapper key={v4()} permission="view" resource="scheduleitemweeklyotc">
                              <Link to={'/schedule/shifts/shift/edit/' + scheduleItemId + '/' + date}>
                                <Dropdown.Item
                                  key={v4()}
                                  icon="edit-3"
                                >
                                  {t("general.edit")}
                                </Dropdown.Item>
                              </Link>
                            </HasPermissionWrapper>,
                            <HasPermissionWrapper key={v4()} permission="change" resource="scheduleshift">
                              <Dropdown.ItemDivider key={v4()} />
                              <Link to={'/schedule/shifts/all/edit/' + scheduleItemId}>
                                <Dropdown.Item
                                  key={v4()}
                                  badge={t('schedule.shifts.all_shifts_in_series')}
                                  badgeType="secondary"
                                  icon="edit-3"
                                >
                                    {t("general.edit")}
                                </Dropdown.Item>
                              </Link>
                            </HasPermissionWrapper>,
                            <HasPermissionWrapper key={v4()} permission="delete" resource="scheduleshift">
                              <Dropdown.ItemDivider key={v4()} />
                              <span className="text-red">
                              <Dropdown.Item
                                key={v4()}
                                badge={t('schedule.shifts.all_shifts_in_series')}
                                badgeType="danger"
                                icon="trash-2"
                                onClick={() => {
                                  confirm_delete({
                                    t: t,
                                    msgConfirm: t("schedule.shifts.delete_confirm_msg"),
                                    msgDescription: <p key={v4()}>
                                      {moment(date + ' ' + timeStart).format(timeFormat)} {' - '}
                                      {moment(date + ' ' + timeEnd).format(timeFormat)} {' '} 
                                      {organizationShift.name} {' '} @ {' '}
                                      {organizationLocationRoom.organizationLocation.name} {' '}
                                      {organizationLocationRoom.name}
                                      </p>,
                                    msgSuccess: t('schedule.shifts.deleted'),
                                    deleteFunction: deleteScheduleShift,
                                    functionVariables: { variables: {
                                      input: {
                                        id: scheduleItemId
                                      }
                                    }, refetchQueries: [
                                      { query: GET_SHIFTS_QUERY, variables: get_list_query_variables() }
                                    ]}
                                  })
                                }}>
                              {t("general.delete")}
                              </Dropdown.Item>
                              </span>
                            </HasPermissionWrapper>
                          ]}
                        />
                      </Table.Col>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            }
          </Card>
        </div>
      ))}
    </ScheduleShiftsBase>
  )
}

export default withTranslation()(withRouter(ScheduleShifts))

//     <SiteWrapper>
//       <div className="my-3 my-md-5">
//         <Query query={GET_SHIFTS_QUERY} variables={get_list_query_variables()}>
//           {({ loading, error, data, refetch }) => {
//             // Loading
//             if (loading) return (
//               <Container>
//                 <p>{t('general.loading_with_dots')}</p>
//               </Container>
//             )
//             // Error
//             if (error) {
//               console.log(error)
//               return (
//                 <Container>
//                   <p>{t('general.error_sad_smiley')}</p>
//                 </Container>
//               )
//             }
//             const headerOptions = <Card.Options>
//               {/* <Button color={(!archived) ? 'primary': 'secondary'}  
//                       size="sm"
//                       onClick={() => {archived=false; refetch({archived});}}>
//                 {t('general.current')}
//               </Button>
//               <Button color={(archived) ? 'primary': 'secondary'} 
//                       size="sm" 
//                       className="ml-2" 
//                       onClick={() => {archived=true; refetch({archived});}}>
//                 {t('general.archive')}
//               </Button> */}
//             </Card.Options>
            
//             // Empty list
//             if (!data.scheduleShifts.length) { return (
//               <ContentCard cardTitle={t('schedule.shifts.title')}
//                             headerContent={headerOptions}
//                             hasCardBody={true}>
//                 <p>
//                   {t('schedule.shifts.empty_list')}
//                 </p>
//               </ContentCard>
//             )} else {   

//             console.log(data)
//             // Life's good! :)
//             return (
//               <Container>
//                 <Page.Header title={t("schedule.title")}>
//                   <div className="page-options d-flex">
//                     <span title={t("schedule.shifts.tooltip_sort_by_location")}>
//                       <Button 
//                         icon="home"
//                         tooltip="text"
//                         className="mr-2"
//                         color={
//                           ((localStorage.getItem(CSLS.SCHEDULE_SHIFTS_ORDER_BY) === "location") || (!localStorage.getItem(CSLS.SCHEDULE_SHIFTS_ORDER_BY))) ?
//                           "azure" : "secondary"
//                         }
//                         onClick={() => {
//                           localStorage.setItem(CSLS.SCHEDULE_SHIFTS_ORDER_BY, "location")
//                           refetch(get_list_query_variables())
//                         }}
//                       />
//                     </span>
//                     <span title={t("schedule.shifts.tooltip_sort_by_starttime")}>
//                       <Button 
//                         icon="clock"
//                         className="mr-2"
//                         color={
//                           (localStorage.getItem(CSLS.SCHEDULE_SHIFTS_ORDER_BY) === "starttime") ?
//                           "azure" : "secondary"
//                         }
//                         onClick={() => {
//                           localStorage.setItem(CSLS.SCHEDULE_SHIFTS_ORDER_BY, "starttime")
//                           refetch(get_list_query_variables())
//                         }}
//                       />
//                     </span>
//                     <CSDatePicker 
//                       className="form-control schedule-list-csdatepicker mr-2"
//                       selected={new Date(localStorage.getItem(CSLS.SCHEDULE_SHIFTS_DATE_FROM))}
//                       isClearable={false}
//                       onChange={(date) => {
//                         let nextWeekFrom = moment(date)
//                         let nextWeekUntil = moment(nextWeekFrom).add(6, 'days')

//                         localStorage.setItem(CSLS.SCHEDULE_SHIFTS_DATE_FROM, nextWeekFrom.format('YYYY-MM-DD')) 
//                         localStorage.setItem(CSLS.SCHEDULE_SHIFTS_DATE_UNTIL, nextWeekUntil.format('YYYY-MM-DD')) 

//                         console.log(get_list_query_variables())

//                         refetch(get_list_query_variables())
//                       }}
//                       placeholderText={t('schedule.shifts.go_to_date')}
//                     />
//                     <Button.List className="schedule-list-page-options-btn-list">
//                       <Button 
//                         icon="chevron-left"
//                         color="secondary"
//                         onClick={ () => {
//                           let nextWeekFrom = moment(localStorage.getItem(CSLS.SCHEDULE_SHIFTS_DATE_FROM)).subtract(7, 'days')
//                           let nextWeekUntil = moment(nextWeekFrom).add(6, 'days')
                          
//                           localStorage.setItem(CSLS.SCHEDULE_SHIFTS_DATE_FROM, nextWeekFrom.format('YYYY-MM-DD')) 
//                           localStorage.setItem(CSLS.SCHEDULE_SHIFTS_DATE_UNTIL, nextWeekUntil.format('YYYY-MM-DD')) 

//                           refetch(get_list_query_variables())
//                       }} />
//                       <Button 
//                         icon="sunset"
//                         color="secondary"
//                         onClick={ () => {
//                           let currentWeekFrom = moment()
//                           let currentWeekUntil = moment(currentWeekFrom).add(6, 'days')

//                           localStorage.setItem(CSLS.SCHEDULE_SHIFTS_DATE_FROM, currentWeekFrom.format('YYYY-MM-DD')) 
//                           localStorage.setItem(CSLS.SCHEDULE_SHIFTS_DATE_UNTIL, currentWeekUntil.format('YYYY-MM-DD')) 
                          
//                           refetch(get_list_query_variables())
//                       }} />
//                       <Button 
//                         icon="chevron-right"
//                         color="secondary"
//                         onClick={ () => {
//                           let nextWeekFrom = moment(localStorage.getItem(CSLS.SCHEDULE_SHIFTS_DATE_FROM)).add(7, 'days')
//                           let nextWeekUntil = moment(nextWeekFrom).add(6, 'days')
                          
//                           localStorage.setItem(CSLS.SCHEDULE_SHIFTS_DATE_FROM, nextWeekFrom.format('YYYY-MM-DD')) 
//                           localStorage.setItem(CSLS.SCHEDULE_SHIFTS_DATE_UNTIL, nextWeekUntil.format('YYYY-MM-DD')) 

//                           refetch(get_list_query_variables())
//                       }} />
//                     </Button.List> 
//                   </div>
//                 </Page.Header>
//                 <Grid.Row>
//                   <Grid.Col md={9}>
//                     {
                      
//                       ))}
//                 </Grid.Col>
//                 <Grid.Col md={3}>
//                   <HasPermissionWrapper permission="add"
//                                         resource="scheduleclass">
//                     <Button color="primary btn-block mb-1"
//                             onClick={() => history.push("/schedule/shifts/add")}>
//                       <Icon prefix="fe" name="plus-circle" /> {t('schedule.shifts.add')}
//                     </Button>
//                   </HasPermissionWrapper>
//                   <div>
//                     <Button
//                       className="pull-right"
//                       color="link"
//                       size="sm"
//                       onClick={() => {
//                         localStorage.setItem(CSLS.SCHEDULE_SHIFTS_FILTER_CLASSTYPE, "")
//                         localStorage.setItem(CSLS.SCHEDULE_SHIFTS_FILTER_LEVEL, "")
//                         localStorage.setItem(CSLS.SCHEDULE_SHIFTS_FILTER_LOCATION, "")
//                         refetch(get_list_query_variables())
//                       }}
//                     >
//                       {t("general.clear")}
//                     </Button>
//                   </div>
//                   <h5 className="mt-2 pt-1">{t("general.filter")}</h5>
//                   <ScheduleClassesFilter data={data} refetch={refetch} />
//                   <h5>{t("general.menu")}</h5>
//               </Grid.Col>
//             </Grid.Row>
//           </Container>
//         )}}}
//         </Query>
//       </div>
//     </SiteWrapper>
//   )
// }
