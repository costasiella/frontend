import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import ShopBase from "../ShopBase"

function ShopEventTicketBase({ t, match, history, children, subTitle }) {
  const eventId = match.params.event_id
  
  return (
    <ShopBase 
      title={t("shop.events.ticket.title")}
      subTitle={subTitle}
      returnUrl={`/shop/events/${eventId}`}
      checkoutProgress="order"
    >
      {children}
    </ShopBase>
  )
}

export default withTranslation()(withRouter(ShopEventTicketBase))