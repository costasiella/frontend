import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import ShopBase from "../ShopBase"

function CookiePolicyBase({ t, match, history, children, pageHeaderOptions="" }) {
  
  return (
    <ShopBase title={t("cookie_policy.title")} pageHeaderOptions={pageHeaderOptions}>
      {children}
    </ShopBase>
  )
}


export default withTranslation()(withRouter(CookiePolicyBase))