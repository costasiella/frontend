// @flow

import React, { useContext } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'

import moment from 'moment'

import {
  Badge,
  Grid,
  Icon,
  List,
  PricingCard
} from "tabler-react";

import AppSettingsContext from '../../context/AppSettingsContext'

// Example:
// https://github.com/tabler/tabler-react/blob/master/example/src/interface/PricingCardsPage.react.js


function ShopEventTicketPricingCard({ t, match, eventTicket, showButton=true, active=false }) {
  // eventTicket should be an object with at least the following values from an organizationClasspass object:
  // id, name, priceDisplay, 
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const timeFormat = appSettings.timeFormatMoment
  console.log(eventTicket)
  const ticketScheduleItems = eventTicket.ticketScheduleItems

  const eventId = match.params.event_id

  return (
    <PricingCard active={active}>
      <PricingCard.Category>
        {eventTicket.name}
        {(eventTicket.isEarlybirdPrice) ? <div><Badge color="primary">{t("shop.event.ticket.earlybird_price")}</Badge></div> : ""}
      </PricingCard.Category>
      <PricingCard.Price>
        { (eventTicket.price == 0) ? 
          t("shop.event.ticket.free") :
          eventTicket.totalPriceDisplay 
        }
      </PricingCard.Price>
      <PricingCard.AttributeList>
        {(eventTicket.isEarlybirdPrice) ? 
          <PricingCard.AttributeItem>
            {t("shop.event.ticket.regular_price")} {eventTicket.priceDisplay}
          </PricingCard.AttributeItem>
          : "" 
        }
        {ticketScheduleItems.map(({ scheduleItem }) => (
          <PricingCard.AttributeItem>
              <Icon name="calendar" /> { " " }
              {moment(scheduleItem.dateStart).format(dateFormat)} {" "}
              {/* Start & end time */}
              {moment(scheduleItem.dateStart + ' ' + scheduleItem.timeStart).format(timeFormat)} {' - '}
              {moment(scheduleItem.dateStart + ' ' + scheduleItem.timeEnd).format(timeFormat)} { ' ' }
            <br />
            <small className="text-muted">
              {scheduleItem.name} <Icon name="map-pin" /> {scheduleItem.organizationLocationRoom.organizationLocation.name}
            </small>
          </PricingCard.AttributeItem>
        ))}
      </PricingCard.AttributeList>
      {(showButton && !eventTicket.isSoldOut) ?
        <Link to={`/shop/events/${eventId}/ticket/${eventTicket.id}`}>
          <PricingCard.Button>
            {t("shop.event.ticket.choose")} <Icon name="chevron-right" />
          </PricingCard.Button>
        </Link>
        : "" 
      }
      {(showButton && eventTicket.isSoldOut) ? 
        <PricingCard.Button 
          className="disabled"
        >
          {t('general.sold_out')}
        </PricingCard.Button> : ""}
    </PricingCard>
  )
}


export default withTranslation()(withRouter(ShopEventTicketPricingCard))


{/* <Grid.Col sm={6} lg={3}>
<PricingCard active>
  <PricingCard.Category>{"Premium"}</PricingCard.Category>
  <PricingCard.Price>{"$49"} </PricingCard.Price>
  <PricingCard.AttributeList>
    <PricingCard.AttributeItem>
      <strong>10 </strong>
      {"Users"}
    </PricingCard.AttributeItem>
    <PricingCard.AttributeItem hasIcon available>
      {"Sharing Tools"}
    </PricingCard.AttributeItem>
    <PricingCard.AttributeItem hasIcon available>
      {"Design Tools"}
    </PricingCard.AttributeItem>
    <PricingCard.AttributeItem hasIcon available={false}>
      {"Private Messages"}
    </PricingCard.AttributeItem>
    <PricingCard.AttributeItem hasIcon available={false}>
      {"Twitter API"}
    </PricingCard.AttributeItem>
  </PricingCard.AttributeList>
  <PricingCard.Button active>{"Choose plan"} </PricingCard.Button>
</PricingCard>
</Grid.Col> */}