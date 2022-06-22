import React, { useContext } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { gql } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import AppSettingsContext from '../../context/AppSettingsContext'

import {
  Badge,
  Dropdown,
  Icon,
  Card,
  Table,
  Grid,
} from "tabler-react";
import HasPermissionWrapper from "../../HasPermissionWrapper"
import { confirmAlert } from 'react-confirm-alert'
import { toast } from 'react-toastify'

import CSLS from "../../../tools/cs_local_storage"


import BadgeBoolean from "../../ui/BadgeBoolean"
import ScheduleClassesBase from './ScheduleClassesBase'

import { GET_CLASSES_QUERY } from "./queries"
import { 
  get_class_messages,
  get_list_query_variables, 
  represent_class_status,
  represent_instructor 
} from './tools'

import moment from 'moment'


const DELETE_SCHEDULE_CLASS = gql`
  mutation DeleteScheduleClass($input: DeleteScheduleClassInput!) {
    deleteScheduleClass(input: $input) {
      ok
    }
  }
`


const confirm_delete = ({t, msgConfirm, msgDescription, msgSuccess, deleteFunction, functionVariables}) => {
  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div key={v4()} className='custom-ui'>
          <h1>{t('general.confirm_delete')}</h1>
          {msgConfirm}
          {msgDescription}
          <button className="btn btn-link pull-right" onClick={onClose}>{t('general.confirm_delete_no')}</button>
          <button
            className="btn btn-danger"
            onClick={() => {
              deleteFunction(functionVariables)
                .then(({ data }) => {
                  console.log('got data', data);
                  toast.success(
                    msgSuccess, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                }).catch((error) => {
                  toast.error((t('general.toast_server_error')) +  error, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  console.log('there was an error sending the query', error);
                })
              onClose()
            }}
          >
            <Icon name="trash-2" /> {t('general.confirm_delete_yes')}
          </button>
        </div>
      )
    }
  })
}


// Set some initial values for dates, if not found
if (!localStorage.getItem(CSLS.SCHEDULE_CLASSES_DATE_FROM)) {
  console.log('date from not found... defaulting to today...')
  localStorage.setItem(CSLS.SCHEDULE_CLASSES_DATE_FROM, moment().format('YYYY-MM-DD')) 
  localStorage.setItem(CSLS.SCHEDULE_CLASSES_DATE_UNTIL, moment().add(6, 'days').format('YYYY-MM-DD')) 
} 


function ScheduleClasses ({ t, history }) {
  const appSettings = useContext(AppSettingsContext)
  const timeFormat = appSettings.timeFormatMoment

  const {loading, error, data, refetch} = useQuery(GET_CLASSES_QUERY, {
    variables: get_list_query_variables(),
    fetchPolicy: "network-only"
  })
  const [deleteScheduleClass] = useMutation(DELETE_SCHEDULE_CLASS)

  if (loading) {
    return (
      <ScheduleClassesBase>
        <p>{t('general.loading_with_dots')}</p>
      </ScheduleClassesBase>
    )
  }

  if (error) {
    return (
      <ScheduleClassesBase>
        <p>{t('general.error_sad_smiley')}</p>
      </ScheduleClassesBase>
    )
  }

  const classes = data.scheduleClasses
       
  // Empty list
  if (!classes.length) { return (
    <ScheduleClassesBase>
      <p>
        {t('schedule.classes.empty_list')}
      </p>
    </ScheduleClassesBase>
  )} 

  return (
    <ScheduleClassesBase data={data} refetch={refetch}>
      { data.scheduleClasses.map(({ date, classes }) => (
        <React.Fragment>
          <h3>
            {moment(date).format("dddd")} {' '}
            <small className="text-muted">
                  {moment(date).format("LL")} 
            </small>
          </h3>
          {!(classes.length) ? <h4>{t('schedule.classes.empty_list')}</h4> :
            classes.map((
              { scheduleItemId, 
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
                countAttendance,
                displayPublic }) => (
                  <Card>
                    <Card.Body>
                      <Grid.Row>
                        <Grid.Col xs={9} sm={9} md={10}>
                          <Grid.Row>
                            <Grid.Col xs={12}>
                              <h5>
                                {/* Class type */}
                                {organizationClasstype.name} { ' ' }
                                {/* Start & end time */}
                                {moment(date + ' ' + timeStart).format(timeFormat)} {' - '}
                                {moment(date + ' ' + timeEnd).format(timeFormat)} { ' ' }
                                {organizationLevel && <small className="text-muted ml-2">
                                  {organizationLevel.name}
                                </small>}
                                
                                {(frequencyType === 'SPECIFIC') ? 
                                  <Badge color="primary" className="ml-2">{t('general.once')}</Badge> : 
                                  null } 
                                {(frequencyType === 'LAST_WEEKDAY_OF_MONTH') ? 
                                  <Badge color="success" className="ml-2">{t('general.monthly')}</Badge> : 
                                  null } 
                              </h5>
                            </Grid.Col>
                          </Grid.Row>
                          <Grid.Row>
                            <Grid.Col xs={12}>
                              {/* Instructor(s) */}
                              { (account) ? 
                                  represent_instructor(account.fullName, role) : 
                                  <span className="text-red">{t("schedule.classes.no_instructor")}</span>
                              } <br />
                              <small className="text-muted">
                                {(account2) ? represent_instructor(account2.fullName, role2) : ""}
                              </small>
                            </Grid.Col>
                            <Grid.Col xs={12}>
                              {/* Location */}
                              <Icon name="home" /> {organizationLocationRoom.organizationLocation.name} 
                              <small className="text-muted"> | {organizationLocationRoom.name}</small>
                            </Grid.Col>
                          </Grid.Row>
                        </Grid.Col>
                        <Grid.Col xs={3} sm={3} md={2}>
                          <div className='float-right'>
                            <Dropdown
                              key={v4()}
                              className="pull-right"
                              type="button"
                              toggle
                              color="secondary"
                              triggerContent={<React.Fragment>
                                  <span className="d-xs-none">{t("general.manage")}</span>
                                  <span className="d-sm-none d-md-none d-lg-none d-xl-none"><Icon name="more-horizontal" /></span>
                                </React.Fragment>}
                              items={[
                                <HasPermissionWrapper key={v4()} permission="view" resource="scheduleitemattendance">
                                  <Link to={'/schedule/classes/class/attendance/' + scheduleItemId + '/' + date}>
                                    <Dropdown.Item
                                      key={v4()}
                                      icon="check-circle"
                                    >
                                        {t("general.attendance")}
                                    </Dropdown.Item>
                                  </Link>
                                </HasPermissionWrapper>,
                                <HasPermissionWrapper key={v4()} permission="view" resource="scheduleitemattendance">
                                  <Link to={'/schedule/classes/class/attendance_chart/' + scheduleItemId + '/' + date}>
                                    <Dropdown.Item
                                      key={v4()}
                                      icon="bar-chart-2">
                                        {t("schedule.classes.class.attendance_chart.title")}
                                    </Dropdown.Item>
                                  </Link>
                                </HasPermissionWrapper>,
                                <HasPermissionWrapper key={v4()} permission="view" resource="scheduleitemweeklyotc">
                                  <Link to={'/schedule/classes/class/edit/' + scheduleItemId + '/' + date}>
                                    <Dropdown.Item
                                      key={v4()}
                                      icon="edit-3"
                                    >
                                      {t("general.edit")}
                                    </Dropdown.Item>
                                  </Link>
                                </HasPermissionWrapper>,
                                <HasPermissionWrapper key={v4()} permission="change" resource="scheduleclass">
                                  <Dropdown.ItemDivider key={v4()} />
                                  <Link to={'/schedule/classes/all/edit/' + scheduleItemId}>
                                    <Dropdown.Item
                                      key={v4()}
                                      badge={t('schedule.classes.all_classes_in_series')}
                                      badgeType="secondary"
                                      icon="edit-3"
                                    >
                                        {t("general.edit")}
                                    </Dropdown.Item>
                                  </Link>
                                </HasPermissionWrapper>,
                                <HasPermissionWrapper key={v4()} permission="delete" resource="scheduleclass">
                                  <Dropdown.ItemDivider key={v4()} />
                                  <span className="text-red">
                                  <Dropdown.Item
                                    key={v4()}
                                    badge={t('schedule.classes.all_classes_in_series')}
                                    badgeType="danger"
                                    icon="trash-2"
                                    onClick={() => {
                                      confirm_delete({
                                        t: t,
                                        msgConfirm: t("schedule.classes.delete_confirm_msg"),
                                        msgDescription: <p key={v4()}>
                                          {moment(date + ' ' + timeStart).format('LT')} {' - '}
                                          {moment(date + ' ' + timeEnd).format('LT')} {' '} @ {' '}
                                          {organizationLocationRoom.organizationLocation.name} {' '}
                                          {organizationLocationRoom.name}
                                          {organizationClasstype.Name}
                                          </p>,
                                        msgSuccess: t('schedule.classes.deleted'),
                                        deleteFunction: deleteScheduleClass,
                                        functionVariables: { variables: {
                                          input: {
                                            id: scheduleItemId
                                          }
                                        }, refetchQueries: [
                                          { query: GET_CLASSES_QUERY, variables: get_list_query_variables() }
                                        ]}
                                      })
                                    }}>
                                  {t("general.delete")}
                                  </Dropdown.Item>
                                  </span>
                                </HasPermissionWrapper>
                              ]}
                              />
                            </div>
                        </Grid.Col>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Col> 
                         <small className="text-muted">{get_class_messages(t, status, description, holiday, holidayName)}</small>
                        </Grid.Col>
                        <Grid.Col>
                          {/* Attendance */}
                          <small className='float-right'><Icon name="users" /> {countAttendance}/{spaces}</small>
                        </Grid.Col>
                      </Grid.Row>
                    </Card.Body>
                  </Card>
                )
            )}

          <Card>
            <Card.Header>
              <Card.Title>
                <b>{moment(date).format("dddd")}</b> {' '}
                <span className="text-muted">
                  {moment(date).format("LL")} 
                </span>
              </Card.Title>
            </Card.Header>
            {!(classes.length) ? <Card.Body>{t('schedule.classes.empty_list')}</Card.Body> :
              <Table cards>
                <Table.Header>
                  <Table.Row key={v4()}>
                    <Table.ColHeader /> 
                    <Table.ColHeader>{t('general.time')}</Table.ColHeader>
                    <Table.ColHeader>{t('general.location')}</Table.ColHeader>
                    <Table.ColHeader>{t('general.class')}</Table.ColHeader>
                    <Table.ColHeader>{t('general.instructor')}</Table.ColHeader>
                    <Table.ColHeader>{t('general.public')}</Table.ColHeader>
                    <Table.ColHeader><Icon name="users" /></Table.ColHeader>
                    <Table.ColHeader></Table.ColHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {classes.map((
                    { scheduleItemId, 
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
                      countAttendance,
                      displayPublic }) => (
                    <Table.Row key={v4()}>
                      <Table.Col>
                        {represent_class_status(status)}
                      </Table.Col>
                      <Table.Col>
                        {/* Start & end time */}
                        {moment(date + ' ' + timeStart).format(timeFormat)} {' - '}
                        {moment(date + ' ' + timeEnd).format(timeFormat)} { ' ' }
                        {(frequencyType === 'SPECIFIC') ? <Badge color="primary">{t('general.once')}</Badge> : null } 
                        {(frequencyType === 'LAST_WEEKDAY_OF_MONTH') ? <Badge color="success">{t('general.monthly')}</Badge> : null } 
                        <br />
                        <small className="text-muted">{get_class_messages(t, status, description, holiday, holidayName)}</small>
                      </Table.Col>
                      <Table.Col>
                        {/* Location */}
                        {organizationLocationRoom.organizationLocation.name} <br />
                        <small className="text-muted">{organizationLocationRoom.name}</small>
                      </Table.Col>
                      <Table.Col>
                        {/* Type and level */}
                        {organizationClasstype.name} <br />
                        <small className="text-muted">
                          {(organizationLevel) ? organizationLevel.name: ""}
                        </small>
                      </Table.Col>
                      <Table.Col>
                        {/* Instructor(s) */}
                        { (account) ? 
                            represent_instructor(account.fullName, role) : 
                            <span className="text-red">{t("schedule.classes.no_instructor")}</span>
                        } <br />
                        <small className="text-muted">
                          {(account2) ? represent_instructor(account2.fullName, role2) : ""}
                        </small>
                      </Table.Col>
                      <Table.Col>
                        {/* Public */}
                        <BadgeBoolean value={displayPublic} />
                      </Table.Col>
                      <Table.Col>
                        {/* Attendance */}
                        {countAttendance}/{spaces}
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
                            <HasPermissionWrapper key={v4()} permission="view" resource="scheduleitemattendance">
                              <Link to={'/schedule/classes/class/attendance/' + scheduleItemId + '/' + date}>
                                <Dropdown.Item
                                  key={v4()}
                                  icon="check-circle"
                                >
                                    {t("general.attendance")}
                                </Dropdown.Item>
                              </Link>
                            </HasPermissionWrapper>,
                            <HasPermissionWrapper key={v4()} permission="view" resource="scheduleitemattendance">
                              <Link to={'/schedule/classes/class/attendance_chart/' + scheduleItemId + '/' + date}>
                                <Dropdown.Item
                                  key={v4()}
                                  icon="bar-chart-2">
                                    {t("schedule.classes.class.attendance_chart.title")}
                                </Dropdown.Item>
                              </Link>
                            </HasPermissionWrapper>,
                            <HasPermissionWrapper key={v4()} permission="view" resource="scheduleitemweeklyotc">
                              <Link to={'/schedule/classes/class/edit/' + scheduleItemId + '/' + date}>
                                <Dropdown.Item
                                  key={v4()}
                                  icon="edit-3"
                                >
                                  {t("general.edit")}
                                </Dropdown.Item>
                              </Link>
                            </HasPermissionWrapper>,
                            <HasPermissionWrapper key={v4()} permission="change" resource="scheduleclass">
                              <Dropdown.ItemDivider key={v4()} />
                              <Link to={'/schedule/classes/all/edit/' + scheduleItemId}>
                                <Dropdown.Item
                                  key={v4()}
                                  badge={t('schedule.classes.all_classes_in_series')}
                                  badgeType="secondary"
                                  icon="edit-3"
                                >
                                    {t("general.edit")}
                                </Dropdown.Item>
                              </Link>
                            </HasPermissionWrapper>,
                            <HasPermissionWrapper key={v4()} permission="delete" resource="scheduleclass">
                              <Dropdown.ItemDivider key={v4()} />
                              <span className="text-red">
                              <Dropdown.Item
                                key={v4()}
                                badge={t('schedule.classes.all_classes_in_series')}
                                badgeType="danger"
                                icon="trash-2"
                                onClick={() => {
                                  confirm_delete({
                                    t: t,
                                    msgConfirm: t("schedule.classes.delete_confirm_msg"),
                                    msgDescription: <p key={v4()}>
                                      {moment(date + ' ' + timeStart).format('LT')} {' - '}
                                      {moment(date + ' ' + timeEnd).format('LT')} {' '} @ {' '}
                                      {organizationLocationRoom.organizationLocation.name} {' '}
                                      {organizationLocationRoom.name}
                                      {organizationClasstype.Name}
                                      </p>,
                                    msgSuccess: t('schedule.classes.deleted'),
                                    deleteFunction: deleteScheduleClass,
                                    functionVariables: { variables: {
                                      input: {
                                        id: scheduleItemId
                                      }
                                    }, refetchQueries: [
                                      { query: GET_CLASSES_QUERY, variables: get_list_query_variables() }
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
        </React.Fragment >
      ))}
    </ScheduleClassesBase>
  )
}

export default withTranslation()(withRouter(ScheduleClasses))

//     <SiteWrapper>
//       <div className="my-3 my-md-5">
//         <Query query={GET_CLASSES_QUERY} variables={get_list_query_variables()}>
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
//             if (!data.scheduleClasses.length) { return (
//               <ContentCard cardTitle={t('schedule.classes.title')}
//                             headerContent={headerOptions}
//                             hasCardBody={true}>
//                 <p>
//                   {t('schedule.classes.empty_list')}
//                 </p>
//               </ContentCard>
//             )} else {   

//             console.log(data)
//             // Life's good! :)
//             return (
//               <Container>
//                 <Page.Header title={t("schedule.title")}>
//                   <div className="page-options d-flex">
//                     <span title={t("schedule.classes.tooltip_sort_by_location")}>
//                       <Button 
//                         icon="home"
//                         tooltip="text"
//                         className="mr-2"
//                         color={
//                           ((localStorage.getItem(CSLS.SCHEDULE_CLASSES_ORDER_BY) === "location") || (!localStorage.getItem(CSLS.SCHEDULE_CLASSES_ORDER_BY))) ?
//                           "azure" : "secondary"
//                         }
//                         onClick={() => {
//                           localStorage.setItem(CSLS.SCHEDULE_CLASSES_ORDER_BY, "location")
//                           refetch(get_list_query_variables())
//                         }}
//                       />
//                     </span>
//                     <span title={t("schedule.classes.tooltip_sort_by_starttime")}>
//                       <Button 
//                         icon="clock"
//                         className="mr-2"
//                         color={
//                           (localStorage.getItem(CSLS.SCHEDULE_CLASSES_ORDER_BY) === "starttime") ?
//                           "azure" : "secondary"
//                         }
//                         onClick={() => {
//                           localStorage.setItem(CSLS.SCHEDULE_CLASSES_ORDER_BY, "starttime")
//                           refetch(get_list_query_variables())
//                         }}
//                       />
//                     </span>
//                     <CSDatePicker 
//                       className="form-control schedule-list-csdatepicker mr-2"
//                       selected={new Date(localStorage.getItem(CSLS.SCHEDULE_CLASSES_DATE_FROM))}
//                       isClearable={false}
//                       onChange={(date) => {
//                         let nextWeekFrom = moment(date)
//                         let nextWeekUntil = moment(nextWeekFrom).add(6, 'days')

//                         localStorage.setItem(CSLS.SCHEDULE_CLASSES_DATE_FROM, nextWeekFrom.format('YYYY-MM-DD')) 
//                         localStorage.setItem(CSLS.SCHEDULE_CLASSES_DATE_UNTIL, nextWeekUntil.format('YYYY-MM-DD')) 

//                         console.log(get_list_query_variables())

//                         refetch(get_list_query_variables())
//                       }}
//                       placeholderText={t('schedule.classes.go_to_date')}
//                     />
//                     <Button.List className="schedule-list-page-options-btn-list">
//                       <Button 
//                         icon="chevron-left"
//                         color="secondary"
//                         onClick={ () => {
//                           let nextWeekFrom = moment(localStorage.getItem(CSLS.SCHEDULE_CLASSES_DATE_FROM)).subtract(7, 'days')
//                           let nextWeekUntil = moment(nextWeekFrom).add(6, 'days')
                          
//                           localStorage.setItem(CSLS.SCHEDULE_CLASSES_DATE_FROM, nextWeekFrom.format('YYYY-MM-DD')) 
//                           localStorage.setItem(CSLS.SCHEDULE_CLASSES_DATE_UNTIL, nextWeekUntil.format('YYYY-MM-DD')) 

//                           refetch(get_list_query_variables())
//                       }} />
//                       <Button 
//                         icon="sunset"
//                         color="secondary"
//                         onClick={ () => {
//                           let currentWeekFrom = moment()
//                           let currentWeekUntil = moment(currentWeekFrom).add(6, 'days')

//                           localStorage.setItem(CSLS.SCHEDULE_CLASSES_DATE_FROM, currentWeekFrom.format('YYYY-MM-DD')) 
//                           localStorage.setItem(CSLS.SCHEDULE_CLASSES_DATE_UNTIL, currentWeekUntil.format('YYYY-MM-DD')) 
                          
//                           refetch(get_list_query_variables())
//                       }} />
//                       <Button 
//                         icon="chevron-right"
//                         color="secondary"
//                         onClick={ () => {
//                           let nextWeekFrom = moment(localStorage.getItem(CSLS.SCHEDULE_CLASSES_DATE_FROM)).add(7, 'days')
//                           let nextWeekUntil = moment(nextWeekFrom).add(6, 'days')
                          
//                           localStorage.setItem(CSLS.SCHEDULE_CLASSES_DATE_FROM, nextWeekFrom.format('YYYY-MM-DD')) 
//                           localStorage.setItem(CSLS.SCHEDULE_CLASSES_DATE_UNTIL, nextWeekUntil.format('YYYY-MM-DD')) 

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
//                             onClick={() => history.push("/schedule/classes/add")}>
//                       <Icon prefix="fe" name="plus-circle" /> {t('schedule.classes.add')}
//                     </Button>
//                   </HasPermissionWrapper>
//                   <div>
//                     <Button
//                       className="pull-right"
//                       color="link"
//                       size="sm"
//                       onClick={() => {
//                         localStorage.setItem(CSLS.SCHEDULE_CLASSES_FILTER_CLASSTYPE, "")
//                         localStorage.setItem(CSLS.SCHEDULE_CLASSES_FILTER_LEVEL, "")
//                         localStorage.setItem(CSLS.SCHEDULE_CLASSES_FILTER_LOCATION, "")
//                         refetch(get_list_query_variables())
//                       }}
//                     >
//                       {t("general.clear")}
//                     </Button>
//                   </div>
//                   <h5 className="mt-2 pt-1">{t("general.filter")}</h5>
//                   <ScheduleClassesFilter data={data} refetch={refetch} />
//               </Grid.Col>
//             </Grid.Row>
//           </Container>
//         )}}}
//         </Query>
//       </div>
//     </SiteWrapper>
//   )
// }
