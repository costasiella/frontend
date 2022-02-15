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

import { GET_SCHEDULE_EVENT_ACTIVITY_QUERY } from './queries'
import { GET_SCHEDULE_EVENT_QUERY } from '../queries'

import ScheduleEventActivityBack from "./ScheduleEventActivityBack"
import ScheduleEventEditBaseBase from "../edit/ScheduleEventEditBaseBase"
import ScheduleEventActivityTabs from "./ScheduleEventActivityTabs"


function ScheduleEventActivityEditBase({t, match, history, activeTab, children}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const cardTitle = t("schedule.events.activities.edit")
  const activeLink = "activities"

  const eventId = match.params.event_id
  const scheduleItemId = match.params.id

  const { loading, error, data } = useQuery(GET_SCHEDULE_EVENT_QUERY, {
    variables: { id: eventId }
  })

  const { loading: loadingActivity, error: errorActivity, data: dataActivity } = useQuery(GET_SCHEDULE_EVENT_ACTIVITY_QUERY, {
    variables: {
      id: scheduleItemId
    }
  })

  const sidebarContent = <ScheduleEventActivityBack />

  if (loading || loadingActivity) {
    return (
      <ScheduleEventEditBaseBase sidebarContent={sidebarContent}>
        <Card title={cardTitle}>
          <ScheduleEventActivityTabs active={activeTab} eventId={eventId} scheduleItemId={scheduleItemId}/>
          <Card.Body>
            <Dimmer loading={true} active={true} />
          </Card.Body>
        </Card>
      </ScheduleEventEditBaseBase>
    )
  }

  if (error || errorActivity) {
    return (
      <ScheduleEventEditBaseBase sidebarContent={sidebarContent}>
        <Card title={cardTitle}>
          <ScheduleEventActivityTabs active={activeTab} eventId={eventId} scheduleItemId={scheduleItemId}/>
          <Card.Body>
            {t("schedule.events.error_loading")}
          </Card.Body>
        </Card>
      </ScheduleEventEditBaseBase>
    )
  }

  const event = data.scheduleEvent
  const scheduleItem = dataActivity.scheduleItem
  const dateStart = (event.dateStart) ? moment(event.dateStart).format(dateFormat) : ""
  const cardSubTitle = (scheduleItem) ? 
  <span className="text-muted">
    - {event.name + " " + dateStart}
  </span> : ""

  const cardActivitySubtitle = (scheduleItem) ?
  <span className="text-muted">
    - {scheduleItem.name}
  </span> : ""

  return (
    <ScheduleEventEditBaseBase activeLink={activeLink} sidebarContent={sidebarContent}>
      <Card>
        <Card.Header>
          <Card.Title>{cardTitle} {cardSubTitle} {cardActivitySubtitle}</Card.Title>
        </Card.Header>
        <ScheduleEventActivityTabs active={activeTab} eventId={eventId} scheduleItemId={scheduleItemId}/>
        {children}
      </Card>
    </ScheduleEventEditBaseBase>
  )
}

export default withTranslation()(withRouter(ScheduleEventActivityEditBase))