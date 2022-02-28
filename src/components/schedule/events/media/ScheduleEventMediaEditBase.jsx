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
import { GET_SCHEDULE_EVENT_MEDIA_QUERY } from './queries'
import { GET_SCHEDULE_EVENT_QUERY } from '../queries'
import ScheduleEventMediaBack from "./ScheduleEventMediaBack"
import ScheduleEventEditBaseBase from "../edit/ScheduleEventEditBaseBase"


function ScheduleEventMediaEditBase({t, match, history, activeTab, children}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat

  const eventId = match.params.event_id
  const scheduleEventMediaId = match.params.id
  const cardTitle = t("schedule.events.media.edit")
  const activeLink = "media"
  const returnUrl = `/schedule/events/edit/${eventId}/media/`


  const { loading, error, data } = useQuery(GET_SCHEDULE_EVENT_QUERY, {
    variables: { id: eventId }
  })

  const { loading: loadingMedia, error: errorMedia, data: dataMedia } = useQuery(GET_SCHEDULE_EVENT_MEDIA_QUERY, {
    variables: {
      id: scheduleEventMediaId
    }
  })

  if (loading || loadingMedia) {
    return (
      <ScheduleEventEditBaseBase returnUrl={returnUrl}>
        <Card title={cardTitle}>
          <Card.Body>
            <Dimmer loading={true} active={true} />
          </Card.Body>
        </Card>
      </ScheduleEventEditBaseBase>
    )
  }

  if (error || errorMedia) {
    return (
      <ScheduleEventEditBaseBase returnUrl={returnUrl}>
        <Card title={cardTitle}>
          <Card.Body>
            {t("schedule.events.error_loading")}
          </Card.Body>
        </Card>
      </ScheduleEventEditBaseBase>
    )
  }

  const event = data.scheduleEvent
  const scheduleEventMedia = dataMedia.scheduleEventMedia
  const dateStart = (event.dateStart) ? moment(event.dateStart).format(dateFormat) : ""
  const cardSubTitle = (scheduleEventMedia) ? 
  <span className="text-muted">
    - {event.name + " " + dateStart}
  </span> : ""

  const cardActivitySubtitle = (scheduleEventMedia) ?
  <span className="text-muted">
    - {scheduleEventMedia.description}
  </span> : ""

  return (
    <ScheduleEventEditBaseBase activeLink={activeLink} returnUrl={returnUrl}>
      <Card>
        <Card.Header>
          <Card.Title>{cardTitle} {cardSubTitle} {cardActivitySubtitle}</Card.Title>
        </Card.Header>
        {children}
      </Card>
    </ScheduleEventEditBaseBase>
  )
}

export default withTranslation()(withRouter(ScheduleEventMediaEditBase))