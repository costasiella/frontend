import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import ShopBase from "../ShopBase"

function ShopClasspassesBase({ t, match, history, children }) {  
  return (
    <ShopBase title={t("shop.classpasses.title")}>
      {children}
    </ShopBase>
  )
}


export default withTranslation()(withRouter(ShopClasspassesBase))