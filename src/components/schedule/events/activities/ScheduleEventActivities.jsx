import React, { useContext } from 'react'
import { useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import { v4 } from 'uuid'
import DOMPurify from 'dompurify'
import {
  Button,
  Card,
  Table,
} from "tabler-react";

import AppSettingsContext from '../../../context/AppSettingsContext'
import BadgeBoolean from "../../../ui/BadgeBoolean"
import ButtonAdd from "../../../ui/ButtonAdd"
import { GET_SCHEDULE_EVENT_ACTIVITIES_QUERY } from './queries'
import ScheduleEventEditListBase from "../edit/ScheduleEventEditListBase"
import ScheduleEventActivityDelete from "./ScheduleEventActivityDelete"
import moment from 'moment';


function ScheduleItems({t, match, history}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const timeFormat = appSettings.timeFormatMoment
  console.log(appSettings)
  
  const eventId = match.params.event_id
  const activeLink = "activities"

  const pageHeaderOptions = <ButtonAdd addUrl={`/schedule/events/edit/${eventId}/activities/add`} className="ml-2" />

  const { loading, error, data, fetchMore } = useQuery(GET_SCHEDULE_EVENT_ACTIVITIES_QUERY, {
    variables: {
      scheduleEvent: eventId
    },
    fetchPolicy: "network-only"
  })
  
  if (loading) return (
    <ScheduleEventEditListBase activeLink={activeLink} pageHeaderOptions={pageHeaderOptions}>
      {t("general.loading_with_dots")}
    </ScheduleEventEditListBase>
  )
  if (error) return (
    <ScheduleEventEditListBase activeLink={activeLink} pageHeaderOptions={pageHeaderOptions}>
      <p>{t('general.error_sad_smiley')}</p>
      <p>{error.message}</p>
    </ScheduleEventEditListBase>
  )

  const scheduleItems = data.scheduleItems
  const pageInfo = data.scheduleItems.pageInfo

  // Empty list
  if (!scheduleItems.edges.length) { return (
    <ScheduleEventEditListBase activeLink={activeLink} pageHeaderOptions={pageHeaderOptions}>
      <Card.Body>
        <p>{t('schedule.events.tickets.empty_list')}</p>
      </Card.Body>
    </ScheduleEventEditListBase>
  )}

  const onLoadMore = () => {
    fetchMore({
      variables: {
        after: scheduleItems.pageInfo.endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newEdges = fetchMoreResult.scheduleItems.edges
        const pageInfo = fetchMoreResult.scheduleItems.pageInfo

        return newEdges.length
          ? {
              // Put the new invoices at the end of the list and update `pageInfo`
              // so we have the new `endCursor` and `hasNextPage` values
              scheduleItems: {
                __typename: previousResult.scheduleItems.__typename,
                edges: [ ...previousResult.scheduleItems.edges, ...newEdges ],
                pageInfo
              }
            }
          : previousResult
      }
    })
  }

  return (
    <ScheduleEventEditListBase activeLink={activeLink} pageInfo={pageInfo} onLoadMore={onLoadMore} pageHeaderOptions={pageHeaderOptions}>
      <Table cards>
        <Table.Header>
          <Table.Row key={v4()}>
            <Table.ColHeader>{t('general.time')}</Table.ColHeader>
            <Table.ColHeader>{t('general.name')}</Table.ColHeader>
            <Table.ColHeader>{t('general.location')}</Table.ColHeader>
            <Table.ColHeader>{t('general.instructor')}</Table.ColHeader>
            <Table.ColHeader>{t('general.filled')}</Table.ColHeader>
            <Table.ColHeader>{t('general.public')}</Table.ColHeader>
            <Table.ColHeader></Table.ColHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
            {scheduleItems.edges.map(({ node }) => (
              <Table.Row key={v4()}>
                <Table.Col>
                  {moment(node.dateStart).format(dateFormat)} <br />
                  {/* Start & end time */}
                  <small className="text-muted">
                    {moment(node.dateStart + ' ' + node.timeStart).format(timeFormat)} {' - '}
                    {moment(node.dateStart + ' ' + node.timeEnd).format(timeFormat)} { ' ' }
                  </small>
                </Table.Col>
                <Table.Col>
                  {node.name} <br />
                  <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(node.description) }} className="text-muted"/>
                </Table.Col>
                <Table.Col>
                  {node.organizationLocationRoom.organizationLocation.name} <br />
                  <small className="text-muted">{node.organizationLocationRoom.name}</small>
                </Table.Col>
                <Table.Col>
                  {node.account && node.account.fullName} 
                  {(node.account2) ? <span className="text-muted"><br />{node.account2.fullName}</span> : ""}
                </Table.Col>
                <Table.Col>
                  {node.countAttendance}/{node.spaces}
                </Table.Col>
                <Table.Col>
                  <BadgeBoolean value={node.displayPublic} />
                </Table.Col>
                <Table.Col className="text-right">
                  <Link to={`/schedule/events/edit/${eventId}/activities/edit/${node.id}`}>
                    <Button className='btn-sm' 
                            color="secondary">
                      {t('general.edit')}
                    </Button>
                  </Link>
                  <ScheduleEventActivityDelete id={node.id} />
                </Table.Col>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </ScheduleEventEditListBase>
  )
}

export default withTranslation()(withRouter(ScheduleItems))
