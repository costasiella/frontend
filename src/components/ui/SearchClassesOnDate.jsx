import React, { useContext, useState } from 'react'
import { useQuery } from '@apollo/client'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"
import moment from "moment"

import {
  Alert,
  Badge,
  Button,
  Card,
  Dimmer,
  Grid,
  Icon,
} from "tabler-react";

import AppSettingsContext from '../context/AppSettingsContext'
import { dateToLocalISO } from "../../tools/date_tools"
import { capitalize } from '../../tools/string_tools'
import { 
  get_class_messages,
  represent_class_status,
  represent_instructor 
} from '../schedule/classes/tools'

import BadgePublic from './BadgePublic'
import CSDatePicker from './CSDatePicker'
import { GET_CLASSES_QUERY } from "../schedule/classes/queries"

// Action buttons
// import SettingsMailNotificationButtonAddAccount from '../settings/mail/notifications/SettingsMailNotificationButtonAddAccount'

function get_classes_query_variables(date) {
  let queryVars = {}

  if (date) {
    const searchDate = dateToLocalISO(date)

    queryVars.dateFrom = searchDate
    queryVars.dateUntil = searchDate
  }

  queryVars.attendanceCountType = 'ATTENDING_AND_BOOKED'

  return queryVars
}


function SearchClassesOnDate({ 
  t, 
  match, 
  localStorateKeySearchValue="", 
  btnDisableClassesIds=[],
  btnDisabledMessage="",
  btnAction,
 }) {
  const appSettings = useContext(AppSettingsContext)
  const timeFormat = appSettings.timeFormatMoment

  const [selectedDate, setSelectedDate] = useState(new Date())
  // const [showSearchResults, setShowSearchResults] = useState(false)

  const { loading, error, data, refetch } = useQuery( GET_CLASSES_QUERY, {
    variables: get_classes_query_variables(selectedDate)
  } )

  function renderActionButton(scheduleClassId) {
    switch(btnAction) {
      case "accountEnrollmentAdd":
        const accountId = match.params.account_id
        return <Link to={`/schedule/classes/all/enrollments/${scheduleClassId}/options/${accountId}`}>
          <Button color="primary" outline size="sm">
            <Icon name="plus" /> {t("general.enroll")}
          </Button>
        </Link>
      default:
        return "btnAction type not defined"
    }
  }

  function Search() {
    return <CSDatePicker 
      // className={(errors.dateStart) ? "form-control is-invalid" : "form-control"} 
      className={"form-control"} 
      selected={selectedDate}
      onChange={(date) => {
        if (date) {
          // setShowSearchResults(true)
          setSelectedDate(date)
          refetch(get_classes_query_variables(date))
        } else {
          // showSearchResults(false)
        }
      }}
      // onBlur={() => setFieldTouched("dateStart", true)}
    />

    // return <InputSearch 
    //   className="mb-2"
    //   initialValueKey={localStorateKeySearchValue}
    //   placeholder={placeholderSearch}
    //   onChange={(value) => {
    //     localStorage.setItem(localStorateKeySearchValue, value)
    //     if (value && !called) {
    //       setShowSearchResults(true)
    //       getAccounts({ variables: get_accounts_query_variables(value)})
    //     } else if (value) {
    //       // This is important, as the current relayStylePagination doesn't include args.
    //       // Don't use getAccounts again, but refetch with different vars.
    //       setShowSearchResults(true)
    //       refetch(get_accounts_query_variables(value))
    //     } else {
    //       setShowSearchResults(false)
    //     }
    //   }}
    // />
  }

  // if (!showSearchResults) {
  //   return <Search />
  // }

  if (loading) return (
    <React.Fragment>
      <Search />
      <div>
        <Dimmer active={true} loader={true} />
      </div>
    </React.Fragment>
  )

  if (error) return (
    <React.Fragment>
      <Search />
      <Alert type="danger">{t("general.error_sad_smiley")}</Alert>
    </React.Fragment>
  )

  if (!data.scheduleClasses.length) return (
    <React.Fragment>
      <Search />
      <Alert type="primary">
        <strong>{t("general.search_no_classes_found")}</strong>
      </Alert>
    </React.Fragment>
  )

  return (
    <React.Fragment>
      <Search />
      {(data) ?
      <div className='mt-4'>
        {data.scheduleClasses.map(({ date, classes }) => (
          <React.Fragment key={v4()}>
            <h3>
              {capitalize(moment(date).format("dddd"))} {' '}
              <small className="text-muted">
                    {moment(date).format("LL")} 
              </small>
            </h3>
            {!(classes.length) ? <Card>
                <Card.Body>
                  <h5>{t('schedule.classes.empty_list')} <i className="fa fa-beach"/></h5>
                </Card.Body>
              </Card> 
            :
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
                  <Card key={v4()}>
                    <Card.Body>
                      <Grid.Row>
                        <Grid.Col xs={9} sm={9} md={10}>
                          <Grid.Row>
                            <Grid.Col xs={12}>
                              <h5>
                                {represent_class_status(status)}
                                <span className='mr-2'>
                                {/* Class type */}
                                {organizationClasstype.name} { ' ' }
                                {/* Start & end time */}
                                {moment(date + ' ' + timeStart).format(timeFormat)} {' - '}
                                {moment(date + ' ' + timeEnd).format(timeFormat)} { ' ' }
                                </span>
                                {organizationLevel && <small className="text-muted">
                                  {organizationLevel.name}
                                </small>}
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
                          <span className="float-right">{renderActionButton(scheduleItemId)}</span>
                        </Grid.Col>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Col xs={9} sm={9} md={10}>
                          <div className="mt-1">
                            <BadgePublic className="mr-2" isPublic={displayPublic} />
                            {(frequencyType === 'SPECIFIC') ? 
                              <Badge color="primary" className="mr-2">{t('general.once')}</Badge> : 
                              null } 
                            {(frequencyType === 'LAST_WEEKDAY_OF_MONTH') ? 
                              <Badge color="success" className="mr-2">{t('general.monthly')}</Badge> : 
                              null } 
                            {(status === "CANCELLED") ? 
                              <Badge color="warning" className="mr-2">{t('general.cancelled')}</Badge> : 
                              null } 
                              <small className="text-muted"><br />{get_class_messages(t, status, description, holiday, holidayName)}</small>
                          </div>
                        </Grid.Col>
                        <Grid.Col xs={3} sm={3} md={2}>
                          {/* Attendance */}
                          <small className='float-right mt-1'><Icon name="users" /> {countAttendance}/{spaces}</small>
                        </Grid.Col>
                      </Grid.Row>
                    </Card.Body>
                  </Card>
                )
              )
            }
          </React.Fragment>
        ))}
      </div>
      // <ContentCard cardTitle={t('general.search_results')}
      //             pageInfo={data.accounts.pageInfo}
      //             hasCardBody={false}
      //             onLoadMore={() => {
      //               fetchMore({
      //                 variables: {
      //                 after: data.accounts.pageInfo.endCursor
      //               },
      //               updateQuery: (previousResult, { fetchMoreResult }) => {
      //                 const newEdges = fetchMoreResult.accounts.edges
      //                 const pageInfo = fetchMoreResult.accounts.pageInfo 

      //                 return newEdges.length
      //                   ? {
      //                       // Put the new accounts at the end of the list and update `pageInfo`
      //                       // so we have the new `endCursor` and `hasNextPage` values
      //                       queryAccountsData: {
      //                         accounts: {
      //                           __typename: previousResult.accounts.__typename,
      //                           edges: [ ...previousResult.accounts.edges, ...newEdges ],
      //                           pageInfo
      //                         }
      //                       }
      //                     }
      //                   : previousResult
      //               }
      //             })
      //           }} >
      //   <Table cards>
      //     <Table.Header>
      //       <Table.Row key={v4()}>
      //         <Table.ColHeader>{t('general.name')}</Table.ColHeader>
      //         <Table.ColHeader>{t('general.email')}</Table.ColHeader>
      //         <Table.ColHeader></Table.ColHeader>
      //       </Table.Row>
      //     </Table.Header>
      //     <Table.Body>
      //       {data.accounts.edges.map(({ node }) => (
      //         <Table.Row key={v4()}>
      //           <Table.Col key={v4()}>
      //             {node.fullName}
      //           </Table.Col>
      //           <Table.Col key={v4()}>
      //             {node.email}
      //           </Table.Col>
      //           <Table.Col key={v4()}>
      //             {(btnDisableAccountIds.includes(node.id)) ? 
      //               <span className="pull-right">{btnDisabledMessage}</span> :
      //               <span className="pull-right">{renderActionButton(node.id)}</span>
      //             }   
      //           </Table.Col>
      //         </Table.Row>
      //       ))}
      //     </Table.Body>
      //   </Table>
      // </ContentCard>
      : "" }
    </React.Fragment>
  )
}

export default withTranslation()(withRouter(SearchClassesOnDate))
