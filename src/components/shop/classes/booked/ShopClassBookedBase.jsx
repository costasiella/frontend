import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import ShopBase from "../../ShopBase"

function ShopClassBookedBase({ t, match, history, children, pageHeaderOptions="" }) {
  
  return (
    <ShopBase title={t("shop.classes.booked.title")} pageHeaderOptions={pageHeaderOptions}>
        {children}
    </ShopBase>
  )
}


export default withTranslation()(withRouter(ShopClassBookedBase))