import React, { useContext, useState } from 'react'
import { useQuery } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import moment from 'moment'

import {
  Card,
  Dimmer,
  Table
} from "tabler-react";

import AppSettingsContext from '../../../context/AppSettingsContext'
import BadgeBookingStatus from "../../../ui/BadgeBookingStatus"
import ButtonAdd from '../../../ui/ButtonAdd'
import ContentCard from "../../../general/ContentCard"
import RelationsAccountsBack from "../RelationsAccountsBack"
import AccountClassesBase from "./AccountClassesBase"
import AccountClassDelete from "./AccountClassDelete"
import ScheduleClassAttendanceItemCheckinAndStatus from '../../../schedule/classes/class/attendance/ScheduleClassAttendanceItemCheckinAndStatus'

import { GET_ACCOUNT_CLASSES_QUERY } from "./queries"


function AccountClasses({ t, match, history, location }) {
  const [attendanceRefetching, setAttendanceRefetching] = useState(false)
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const timeFormat = appSettings.timeFormatMoment
  const accountId = match.params.account_id
  const cardTitle = t('relations.account.classes.title')
  const { loading, error, data, fetchMore } = useQuery(GET_ACCOUNT_CLASSES_QUERY, {
    variables: {'account': accountId},
    fetchPolicy: "network-only"
  })

  const pageHeaderButtonList = <React.Fragment>
    <RelationsAccountsBack />
    <ButtonAdd addUrl={`/relations/accounts/${accountId}/classes_find_class`} className="ml-2" />
  </React.Fragment>


  // Loading
  if (loading) return (
    <AccountClassesBase pageHeaderButtonList={pageHeaderButtonList}>
      <Card title={cardTitle}>
        <Card.Body>
          <p>{t('general.loading_with_dots')}</p>
        </Card.Body>
      </Card>
    </AccountClassesBase>
  )
  // Error
  if (error) {
    console.log(error)
    return (
      <AccountClassesBase pageHeaderButtonList={pageHeaderButtonList}>
        <Card title={cardTitle}>
          <Card.Body>
            <p>{t('general.error_sad_smiley')}</p>
          </Card.Body>
        </Card>
      </AccountClassesBase>
    )
  }

  const account = data.account
  const scheduleItemAttendances = data.scheduleItemAttendances
  
  // Empty list
  if (!scheduleItemAttendances.edges.length) {
    return (
      <AccountClassesBase account={account} pageHeaderButtonList={pageHeaderButtonList}>
        <Card title={cardTitle}>
          <Card.Body>
            <p>{t('relations.account.classes.empty_list')}</p>
          </Card.Body>
        </Card>
      </AccountClassesBase>
    )
  }

  // Return populated list
  return (
    <AccountClassesBase account={account} pageHeaderButtonList={pageHeaderButtonList}>
      <ContentCard 
        cardTitle={cardTitle}
        pageInfo={scheduleItemAttendances.pageInfo}
        hasCardBody={false}
        onLoadMore={() => {
          fetchMore({
            variables: {
              after: scheduleItemAttendances.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.scheduleItemAttendances.edges
              const pageInfo = fetchMoreResult.scheduleItemAttendances.pageInfo

              return newEdges.length
                ? {
                    // Put the new scheduleItemAttendances at the end of the list and update `pageInfo`
                    // so we have the new `endCursor` and `hasNextPage` values
                    scheduleItemAttendances: {
                      __typename: previousResult.scheduleItemAttendances.__typename,
                      edges: [ ...previousResult.scheduleItemAttendances.edges, ...newEdges ],
                      pageInfo
                    }
                  }
                : previousResult
            }
          })
        }} 
      >
        <Dimmer active={attendanceRefetching} loader={true}>
          <Table cards>
            <Table.Header>
              <Table.Row key={v4()}>
                <Table.ColHeader>{t('general.time')}</Table.ColHeader>
                <Table.ColHeader>{t('general.class')}</Table.ColHeader>
                <Table.ColHeader>{t('general.location')}</Table.ColHeader>
                <Table.ColHeader>{t('general.booking_status')}</Table.ColHeader>
                <Table.ColHeader></Table.ColHeader>  
                <Table.ColHeader></Table.ColHeader>  
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {scheduleItemAttendances.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  { console.log(node) }
                  { console.log(account) }
                  <Table.Col>
                    { moment(node.date).format(dateFormat) } <br />
                    <span className="text-muted">
                      {moment(node.date + ' ' + node.scheduleItem.timeStart).format(timeFormat)}
                    </span>
                  </Table.Col>
                  <Table.Col>
                    { node.scheduleItem.organizationClasstype.name }
                  </Table.Col>
                  <Table.Col>
                    { node.scheduleItem.organizationLocationRoom.organizationLocation.name } <br />
                    <span className="text-muted">
                      { node.scheduleItem.organizationLocationRoom.name }
                    </span> 
                  </Table.Col>
                  <Table.Col>
                    <BadgeBookingStatus status={node.bookingStatus} />
                  </Table.Col>
                  <Table.Col>
                    <ScheduleClassAttendanceItemCheckinAndStatus
                      setAttendanceRefetching={setAttendanceRefetching}
                      scheduleItemAttendanceNode={node}
                      refetchAccountAttendance={true}
                    />
                  </Table.Col>
                  <Table.Col>
                    <AccountClassDelete account={account} node={node} />
                  </Table.Col>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Dimmer>
      </ContentCard>
    </AccountClassesBase>
  )
}

        
export default withTranslation()(withRouter(AccountClasses))