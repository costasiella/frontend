import React, { useContext } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { useQuery } from '@apollo/client'
import moment from 'moment'

import {
  Card,
  GalleryCard,
  Grid,
} from "tabler-react"

import AppSettingsContext from '../../context/AppSettingsContext'
import ShopEventBase from "./ShopEventBase"
import ShopEventTicketPricingCard from "./ShopEventTicketPricingCard"
import { GET_SCHEDULE_EVENT_QUERY } from "./queries"


function ShopEvent({ t, match, history }) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat

  let tempTitle = t("shop.home.title")
  const eventId = match.params.event_id

  const { loading, error, data } = useQuery(GET_SCHEDULE_EVENT_QUERY, {
    variables: { id: eventId }
  })

  if (loading) return (
    <ShopEventBase title={tempTitle} >
      {t("general.loading_with_dots")}
    </ShopEventBase>
  )
  if (error) return (
    <ShopEventBase title={tempTitle}>
      {t("shop.event.error_loading")}
    </ShopEventBase>
  )

  const event = data.scheduleEvent
  const tickets = event.tickets


  return (
    <ShopEventBase title={event.name}>
      <Grid.Row>
        <Grid.Col xs={12} sm={12} md={12} lg={12}>
          <h5>{event.tagline}</h5>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col xs={12} sm={12} md={6} lg={4}>
          {((event.media.edges.length) ? 
            <GalleryCard>
              <GalleryCard.Image src={(event.media.edges.length) ? event.media.edges[0].node.urlImageThumbnailLarge : ""} />
              <GalleryCard.Details>
                {(event.media.edges.length) ? event.media.edges[0].node.description : ""}
              </GalleryCard.Details>
            </GalleryCard>
          : "" )}
          <Card title={t("general.info")}>
            <Card.Body>
              <h6>{t('general.instructor')}: {(event.instructor) ? event.instructor.fullName: ""}</h6>
              <h6>{t('general.start')}: {(event.dateStart) ? moment(event.dateStart).format(dateFormat): ""}</h6>
              <h6>{t('general.end')}: {(event.dateEnd) ? moment(event.dateEnd).format(dateFormat): ""}</h6>
            </Card.Body>
          </Card>
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={6} lg={8}>
          <Card title={t("general.description")}>
            <Card.Body>
              <h5>{t('general.description')}</h5>
              <div dangerouslySetInnerHTML={{ __html: event.description}} />
            </Card.Body>
          </Card>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col xs={12} sm={12} md={12} lg={12}>
          <h3>{t("shop.event.tickets")}</h3>
        </Grid.Col>
        {tickets.edges.map(({ node }) => (
          <Grid.Col xs={12} sm={12} md={6} lg={4}>
            <ShopEventTicketPricingCard eventID={eventId} eventTicket={node} />
          </Grid.Col>
        ))}
      </Grid.Row>
    </ShopEventBase>
  )
}


export default withTranslation()(withRouter(ShopEvent))
