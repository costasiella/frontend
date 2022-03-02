import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import ShopBase from "../../ShopBase"

function ShopClassesScheduleBase({ t, match, history, children, pageHeaderOptions="" }) {  
  return (
    <ShopBase title={t("shop.classes.title")} pageHeaderOptions={pageHeaderOptions}>
      {children}
    </ShopBase>
  )
}

export default withTranslation()(withRouter(ShopClassesScheduleBase))
