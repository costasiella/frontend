// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import ShopBase from "../ShopBase"

function ShopEventBase({ t, match, history, children, title="" }) {
  
  return (
    <ShopBase 
      title={title}
      returnUrl="/shop/events"
      // checkoutProgress="order"
    >
      {children}
    </ShopBase>
  )
}


export default withTranslation()(withRouter(ShopEventBase))