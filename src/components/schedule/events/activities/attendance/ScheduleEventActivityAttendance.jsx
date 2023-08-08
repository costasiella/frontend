import React from 'react'
import { useQuery } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { v4 } from 'uuid'
import { Link } from 'react-router-dom'

import {
  Card,
  Table
} from "tabler-react"

import { GET_SCHEDULE_ITEM_ATTENDANCES_QUERY } from "./queries"
import ScheduleEventActivityBack from "../ScheduleEventActivityBack"
import ScheduleEventActivityAttendanceBase from "./ScheduleEventActivityAttendanceBase"
import BadgeBookingStatus from "../../../../ui/BadgeBookingStatus"


function ScheduleEventActivityAttendance({ t, history, match }) {
  const eventId = match.params.event_id
  const scheduleItemId = match.params.id
  const returnUrl = `/schedule/events/edit/${eventId}/activities/`
  const activeTab = 'attendance'
  const cardTitle = t("schedule.events.activities.edit")
  const activeLink = "activities"

  const { loading, error, data, fetchMore } = useQuery(GET_SCHEDULE_ITEM_ATTENDANCES_QUERY, {
    variables: {
      schedule_item: scheduleItemId
    },
    fetchPolicy: "network-only"
  })

  const sidebarContent = <ScheduleEventActivityBack />

  if (loading) return (
    <ScheduleEventActivityAttendanceBase 
      sidebarContent={sidebarContent} 
      cardTitle={cardTitle} 
      activeTab={activeTab} 
      returnUrl={returnUrl}
    >
      {t("general.loading_with_dots")}
    </ScheduleEventActivityAttendanceBase>
  )
  if (error) return (
    <ScheduleEventActivityAttendanceBase 
      sidebarContent={sidebarContent} 
      cardTitle={cardTitle} 
      activeTab={activeTab} 
      returnUrl={returnUrl}
    >
      <p>{t('general.error_sad_smiley')}</p>
      <p>{error.message}</p>
    </ScheduleEventActivityAttendanceBase>
  )

  const scheduleItemAttendances = data.scheduleItemAttendances
  console.log(data)
  const pageInfo = scheduleItemAttendances.pageInfo

  // Empty list
  if (!scheduleItemAttendances.edges.length) { return (
    <ScheduleEventActivityAttendanceBase activeLink={activeLink} activeTab={activeTab} sidebarContent={sidebarContent}>
      <Card.Body>
        <p>{t('schedule.events.activities.attendance.empty_list')}</p>
      </Card.Body>
    </ScheduleEventActivityAttendanceBase>
  )}

  const onLoadMore = () => {
    fetchMore({
      variables: {
        after: scheduleItemAttendances.pageInfo.endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newEdges = fetchMoreResult.scheduleItemAttendances.edges
        const pageInfo = fetchMoreResult.scheduleItemAttendances.pageInfo

        return newEdges.length
          ? {
              // Put the new attendance items at the end of the list and update `pageInfo`
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
  }

  return (
    <ScheduleEventActivityAttendanceBase 
      // sidebarContent={sidebarContent} 
      // cardTitle={cardTitle} 
      activeTab={activeTab}
      pageInfo={pageInfo}
      onLoadMore={onLoadMore}
    >
      <Table cards>
        <Table.Header>
          <Table.Row key={v4()}>
            <Table.ColHeader>{t('general.name')}</Table.ColHeader>
            <Table.ColHeader>{t('general.booking_status')}</Table.ColHeader>
            <Table.ColHeader></Table.ColHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {scheduleItemAttendances.edges.map(({ node }) => (
            <Table.Row key={v4()}>
              <Table.Col>
                <Link to={`/relations/accounts/${node.account.id}/profile`}>
                  {node.account.fullName}
                </Link>
              </Table.Col>
              <Table.Col>
                <BadgeBookingStatus status={node.bookingStatus} />
              </Table.Col>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </ScheduleEventActivityAttendanceBase>
  )
}


export default withTranslation()(withRouter(ScheduleEventActivityAttendance))