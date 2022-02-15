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
import { GET_SCHEDULE_EVENT_QUERY } from '../queries'
import ScheduleEventEditBaseBase from "./ScheduleEventEditBaseBase"


function ScheduleEventEditBase({
    t, 
    match, 
    history, 
    activeTab, 
    children, 
    activeLink, 
    cardTitle, 
    pageHeaderOptions,
    sidebarContent, 
    returnUrl="/schedule/events"}) 
  {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const eventId = match.params.event_id

  // Set default card title
  if (!cardTitle) {
    cardTitle = t("schedule.events.edit.title")
  }

  const { loading, error, data } = useQuery(GET_SCHEDULE_EVENT_QUERY, {
    variables: { id: eventId }
  })

  if (loading) {
    return (
      <ScheduleEventEditBaseBase pageHeaderOptions={pageHeaderOptions} sidebarContent={sidebarContent} activeLink={activeLink}>
        <Card title={cardTitle}>
          <Card.Body>
            <Dimmer loading={true} active={true} />
          </Card.Body>
        </Card>
      </ScheduleEventEditBaseBase>
    )
  }

  if (error) {
    return (
      <ScheduleEventEditBaseBase pageHeaderOptions={pageHeaderOptions} sidebarContent={sidebarContent} activeLink={activeLink}>
        <Card title={cardTitle}>
          <Card.Body>
            {t("schedule.events.error_loading")}
          </Card.Body>
        </Card>
      </ScheduleEventEditBaseBase>
    )
  }

  const event = data.scheduleEvent
  const dateStart = (event.dateStart) ? moment(event.dateStart).format(dateFormat) : ""
  const cardSubTitle = (event) ? 
  <span className="text-muted">
    - {event.name + " " + dateStart}
  </span> : ""

  return (
    <ScheduleEventEditBaseBase cardTitle={cardTitle} pageHeaderOptions={pageHeaderOptions} sidebarContent={sidebarContent} activeLink={activeLink}>
      <Card>
        <Card.Header>
          <Card.Title>{cardTitle} {cardSubTitle}</Card.Title>
        </Card.Header>
        {children}
      </Card>
    </ScheduleEventEditBaseBase>
    )
  }

export default withTranslation()(withRouter(ScheduleEventEditBase))