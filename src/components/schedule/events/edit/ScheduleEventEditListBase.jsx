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
import ContentCard from "../../../general/ContentCard"
import { GET_SCHEDULE_EVENT_QUERY } from '../queries'
import ScheduleEventEditBaseBase from "./ScheduleEventEditBaseBase"


function ScheduleEventEditListBase({
  t, 
  match, 
  history, 
  activeTab, 
  pageInfo, 
  onLoadMore, 
  activeLink, 
  children, 
  pageHeaderOptions="",
  pageSubTitle=""
}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const cardTitle = t("schedule.events.edit.title")
  const eventId = match.params.event_id

  const { loading, error, data } = useQuery(GET_SCHEDULE_EVENT_QUERY, {
    variables: { id: eventId }
  })


if (loading) {
  return (
    <ScheduleEventEditBaseBase pageHeaderOptions={pageHeaderOptions} activeLink={activeLink} pageSubTitle={pageSubTitle}>
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
    <ScheduleEventEditBaseBase pageHeaderOptions={pageHeaderOptions} activeLink={activeLink} pageSubTitle={pageSubTitle}>
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
  <ScheduleEventEditBaseBase pageHeaderOptions={pageHeaderOptions} activeLink={activeLink} pageSubTitle={pageSubTitle}>
    <ContentCard 
      cardTitle={<span>{cardTitle} {cardSubTitle}</span>}
      pageInfo={pageInfo}
      onLoadMore={onLoadMore}
    >
      {children}
    </ContentCard>
  </ScheduleEventEditBaseBase>
  )
}

export default withTranslation()(withRouter(ScheduleEventEditListBase))