import React, { useContext } from 'react'
import { useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import { v4 } from 'uuid'

import {
  Button,
  Table,
} from "tabler-react";

import AppSettingsContext from '../../../context/AppSettingsContext'
import BadgeBoolean from "../../../ui/BadgeBoolean"

import { GET_SCHEDULE_EVENT_TICKETS_QUERY } from './queries'
import ScheduleEventEditListBase from "../edit/ScheduleEventEditListBase"
import ScheduleEventTicketDelete from "./ScheduleEventTicketDelete"
import ButtonAdd from '../../../ui/ButtonAdd';
import BadgeSoldOut from '../../../ui/BadgeSoldOut';


function ScheduleEventTickets({t, match, history}) {
  const appSettings = useContext(AppSettingsContext)
  console.log(appSettings)
  
  const eventId = match.params.event_id
  const activeLink = "tickets"

  const pageHeaderOptions = <ButtonAdd addUrl={`/schedule/events/edit/${eventId}/tickets/add`} className="ml-2" />

  const { loading, error, data, fetchMore } = useQuery(GET_SCHEDULE_EVENT_TICKETS_QUERY, {
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

  const scheduleEventTickets = data.scheduleEventTickets
  const pageInfo = data.scheduleEventTickets.pageInfo

  // Empty list
  if (!scheduleEventTickets.edges.length) { return (
    <ScheduleEventEditListBase activeLink={activeLink} pageHeaderOptions={pageHeaderOptions}>
      <p>{t('schedule.events.tickets.empty_list')}</p>
    </ScheduleEventEditListBase>
  )}

  const onLoadMore = () => {
    fetchMore({
      variables: {
        after: scheduleEventTickets.pageInfo.endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newEdges = fetchMoreResult.scheduleEventTickets.edges
        const pageInfo = fetchMoreResult.scheduleEventTickets.pageInfo

        return newEdges.length
          ? {
              // Put the new invoices at the end of the list and update `pageInfo`
              // so we have the new `endCursor` and `hasNextPage` values
              scheduleEventTickets: {
                __typename: previousResult.scheduleEventTickets.__typename,
                edges: [ ...previousResult.scheduleEventTickets.edges, ...newEdges ],
                pageInfo
              }
            }
          : previousResult
      }
    })
  }

  return (
    <ScheduleEventEditListBase activeLink={activeLink} pageInfo={pageInfo} onLoadMore={onLoadMore} pageHeaderOptions={pageHeaderOptions}>
      <Table>
        <Table.Header>
          <Table.Row key={v4()}>
            <Table.ColHeader>{t('general.name')}</Table.ColHeader>
            <Table.ColHeader>{t('general.price')}</Table.ColHeader>
            <Table.ColHeader>{t('general.public')}</Table.ColHeader>
            <Table.ColHeader>{t('general.glaccount')}</Table.ColHeader>
            <Table.ColHeader>{t('general.costcenter')}</Table.ColHeader>
            <Table.ColHeader></Table.ColHeader>
            <Table.ColHeader></Table.ColHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {scheduleEventTickets.edges.map(({ node }) => (
            <Table.Row key={v4()}>
              {/* <Table.Col>
                {moment(node.dateStart).format(dateFormat)}
              </Table.Col>
              <Table.Col>
                {moment(node.dateEnd).format(dateFormat)}
              </Table.Col> */}
              <Table.Col>
                {node.name} <br />
                <div dangerouslySetInnerHTML={{__html: node.description}} className="text-muted"/>
              </Table.Col>
              <Table.Col>
                {node.priceDisplay} <br />
                {(node.isSoldOut) ? <BadgeSoldOut /> : ""}
              </Table.Col>
              <Table.Col>
                <BadgeBoolean value={node.displayPublic} />
              </Table.Col>
              <Table.Col>
                {(node.financeGlaccount) ? node.financeGlaccount.name : ""}
              </Table.Col>
              <Table.Col>
                {(node.financeCostcenter) ? node.financeCostcenter.name : ""}
              </Table.Col>
              <Table.Col className="text-right">
                <Link to={`/schedule/events/edit/${eventId}/tickets/edit/${node.id}`}>
                  <Button className='btn-sm' 
                          color="secondary">
                    {t('general.edit')}
                  </Button>
                </Link>
              </Table.Col>
              <Table.Col className="text-right">
                {/* Check for fullEvent / deletable before showing delete button */}
                {(node.deletable) ? <ScheduleEventTicketDelete id={node.id} /> : ""}
              </Table.Col>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </ScheduleEventEditListBase>
  )
}

export default withTranslation()(withRouter(ScheduleEventTickets))
