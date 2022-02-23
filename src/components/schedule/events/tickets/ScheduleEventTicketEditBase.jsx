import React, { useContext } from 'react'
import { useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import moment from 'moment'

import {
  Dimmer,
  Card,
} from "tabler-react";

import AppSettingsContext from '../../../context/AppSettingsContext'

import { GET_SCHEDULE_EVENT_TICKET_QUERY } from './queries'
import { GET_SCHEDULE_EVENT_QUERY } from '../queries'
import ScheduleEventTicketTabs from "./ScheduleEventTicketTabs"
import ScheduleEventEditBaseBase from "../edit/ScheduleEventEditBaseBase"


function ScheduleEventTicketEditBase({t, match, history, activeTab, children, pageHeaderOptions="", searchResults=""}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat

  const eventId = match.params.event_id
  const ticketId = match.params.id
  const returnUrl = `/schedule/events/edit/${eventId}/tickets/`
  const cardTitle = t("schedule.events.tickets.edit")
  const activeLink = "tickets"

  const { loading, error, data } = useQuery(GET_SCHEDULE_EVENT_QUERY, {
    variables: { id: eventId }
  })

  const { loading: loadingTicket, error: errorTicket, data: dataTicket } = useQuery(GET_SCHEDULE_EVENT_TICKET_QUERY, {
    variables: {
      id: ticketId
    }
  })

  if (loading || loadingTicket) {
    return (
      <ScheduleEventEditBaseBase pageHeaderOptions={pageHeaderOptions} returnUrl={returnUrl}>
        <Card title={cardTitle}>
          <ScheduleEventTicketTabs active={activeTab} eventId={eventId}  ticketId={ticketId}/>
          <Card.Body>
            <Dimmer loading={true} active={true} />
          </Card.Body>
        </Card>
      </ScheduleEventEditBaseBase>
    )
  }

  if (error || errorTicket) {
    return (
      <ScheduleEventEditBaseBase pageHeaderOptions={pageHeaderOptions} returnUrl={returnUrl}>
        <Card title={cardTitle}>
          <ScheduleEventTicketTabs active={activeTab} eventId={eventId} ticketId={ticketId}/>
          <Card.Body>
            {t("schedule.events.error_loading")}
          </Card.Body>
        </Card>
      </ScheduleEventEditBaseBase>
    )
  }

  const event = data.scheduleEvent
  const ticket = dataTicket.scheduleEventTicket
  const dateStart = (event.dateStart) ? moment(event.dateStart).format(dateFormat) : ""
  const cardSubTitle = (event) ? 
  <span className="text-muted">
    - {event.name + " " + dateStart}
  </span> : ""

  const cardTicketSubtitle = (ticket) ?
  <span className="text-muted">
    - {ticket.name}
  </span> : ""

  return (
    <ScheduleEventEditBaseBase pageHeaderOptions={pageHeaderOptions} activeLink={activeLink} returnUrl={returnUrl}>
      {searchResults}
      <Card>
        <Card.Header>
          <Card.Title>{cardTitle} {cardSubTitle} {cardTicketSubtitle}</Card.Title>
        </Card.Header>
        <ScheduleEventTicketTabs active={activeTab} eventId={eventId} ticketId={ticketId}/>
        {children}
      </Card>
    </ScheduleEventEditBaseBase>
  )
}

export default withTranslation()(withRouter(ScheduleEventTicketEditBase))