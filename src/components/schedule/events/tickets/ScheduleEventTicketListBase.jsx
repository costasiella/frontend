import React, { useContext } from 'react'
import { useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import moment from 'moment'

import {
  Dimmer,
  Icon,
  Button,
  Card,
} from "tabler-react";

import AppSettingsContext from '../../../context/AppSettingsContext'
import ContentCard from "../../../general/ContentCard"
import { GET_SCHEDULE_EVENT_QUERY } from '../queries'
import ScheduleEventEditListBase from "../edit/ScheduleEventEditListBase"
import ButtonBack from '../../../ui/ButtonBack';

function ScheduleEventTicketListBase({t, match, history, activeTab, pageInfo, onLoadMore, children}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const cardTitle = t("schedule.events.edit.title")
  const activeLink = "tickets"

  const eventId = match.params.event_id
  const returnUrl = "/schedule/events"

  const { loading, error, data } = useQuery(GET_SCHEDULE_EVENT_QUERY, {
    variables: { id: eventId }
  })

  const pageHeaderOptions = <ButtonBack returnUrl={returnUrl} />

if (loading) {
  return (
    <ScheduleEventEditListBase pageHeaderOptions={pageHeaderOptions} activeLink={activeLink}>
      <Card title={cardTitle}>
        <Card.Body>
          <Dimmer loading={true} active={true} />
        </Card.Body>
      </Card>
    </ScheduleEventEditListBase>
  )
}

if (error) {
  return (
    <ScheduleEventEditListBase pageHeaderOptions={pageHeaderOptions} activeLink={activeLink}>
      <Card title={cardTitle}>
        <Card.Body>
          {t("schedule.events.error_loading")}
        </Card.Body>
      </Card>
    </ScheduleEventEditListBase>
  )
}

const event = data.scheduleEvent
const dateStart = (event.dateStart) ? moment(event.dateStart).format(dateFormat) : ""
const cardSubTitle = (event) ? 
<span className="text-muted">
  - {event.name + " " + dateStart}
</span> : ""

return (
  <ScheduleEventEditListBase pageHeaderOptions={pageHeaderOptions} activeLink={activeLink}>
    <ContentCard 
      cardTitle={<span>{cardTitle} {cardSubTitle}</span>}
      pageInfo={pageInfo}
      onLoadMore={onLoadMore}
    >
      {children}
    </ContentCard>
  </ScheduleEventEditListBase>
  )
}

export default withTranslation()(withRouter(ScheduleEventTicketListBase))