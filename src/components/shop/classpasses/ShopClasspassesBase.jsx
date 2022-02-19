import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import ShopBase from "../ShopBase"

function ShopClasspassesBase({ t, match, history, children }) {  
  return (
    <ShopBase title={t("shop.title")}>
      <h4>{t("shop.classpasses.title")}</h4>
        {children}
    </ShopBase>
  )
}


export default withTranslation()(withRouter(ShopClasspassesBase))