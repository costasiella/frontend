import React, { useContext } from 'react'
import { useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import { v4 } from 'uuid'
import moment from 'moment';

import {
  Button,
  Card,
  Table,
} from "tabler-react";

import AppSettingsContext from '../../../context/AppSettingsContext'
import { GET_SCHEDULE_EVENT_EARLYBIRDS_QUERY } from './queries'
import ScheduleEventEditListBase from "../edit/ScheduleEventEditListBase"
// import ScheduleEventTicketListBase from "./ScheduleEventTicketListBase"
import ScheduleEventEarlybirdDelete from "./ScheduleEventEarlybirdDelete"
import ButtonAdd from '../../../ui/ButtonAdd';


function ScheduleEventEarlybirds({t, match, history}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  console.log(appSettings)
  
  const eventId = match.params.event_id
  const activeLink = "earlybirds"

  const pageHeaderOptions = <ButtonAdd 
    addUrl={`/schedule/events/edit/${eventId}/earlybirds/add`} 
    className="ml-2"
  />

  const { loading, error, data, fetchMore } = useQuery(GET_SCHEDULE_EVENT_EARLYBIRDS_QUERY, {
    variables: {
      scheduleEvent: eventId
    }
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

  console.log('query data')
  console.log(data)

  const scheduleEventEarlybirds = data.scheduleEventEarlybirds
  const pageInfo = data.scheduleEventEarlybirds.pageInfo

  // Empty list
  if (!scheduleEventEarlybirds.edges.length) { return (
    <ScheduleEventEditListBase activeLink={activeLink} pageHeaderOptions={pageHeaderOptions}>
      <Card.Body>
        <p>{t('schedule.events.earlybirds.empty_list')}</p>
      </Card.Body>
    </ScheduleEventEditListBase>
  )}

  const onLoadMore = () => {
    fetchMore({
      variables: {
        after: scheduleEventEarlybirds.pageInfo.endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newEdges = fetchMoreResult.scheduleEventEarlybirds.edges
        const pageInfo = fetchMoreResult.scheduleEventEarlybirds.pageInfo

        return newEdges.length
          ? {
              // Put the new invoices at the end of the list and update `pageInfo`
              // so we have the new `endCursor` and `hasNextPage` values
              scheduleEventEarlybirds: {
                __typename: previousResult.scheduleEventEarlybirds.__typename,
                edges: [ ...previousResult.scheduleEventEarlybirds.edges, ...newEdges ],
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
            <Table.ColHeader>{t('general.date_start')}</Table.ColHeader>
            <Table.ColHeader>{t('general.date_end')}</Table.ColHeader>
            <Table.ColHeader>{t('schedule.events.earlybirds.discountPercentage')}</Table.ColHeader>
            <Table.ColHeader></Table.ColHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
            {scheduleEventEarlybirds.edges.map(({ node }) => (
              <Table.Row key={v4()}>
                <Table.Col>
                  {moment(node.dateStart).format(dateFormat)}
                </Table.Col>
                <Table.Col>
                  {moment(node.dateEnd).format(dateFormat)}
                </Table.Col>
                <Table.Col>
                  {node.discountPercentage} %
                </Table.Col>
                <Table.Col className="text-right">
                  <Link to={`/schedule/events/edit/${eventId}/earlybirds/edit/${node.id}`}>
                    <Button className='btn-sm' 
                            color="secondary">
                      {t('general.edit')}
                    </Button>
                  </Link>
                  <ScheduleEventEarlybirdDelete id={node.id} />
                </Table.Col>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </ScheduleEventEditListBase>
  )
}

export default withTranslation()(withRouter(ScheduleEventEarlybirds))
