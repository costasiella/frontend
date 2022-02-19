import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import AccountSubscriptionEditBase from "../AccountSubscriptionEditBase"


function AccountSubscriptionEditPauseBase({ t, history, match, children}) {
  const activeTab = "pauses"
  const accountId = match.params.account_id
  const subscriptionId = match.params.subscription_id
  const returnUrl = `/relations/accounts/${accountId}/subscriptions/edit/${subscriptionId}/pauses/`

  return (
    <AccountSubscriptionEditBase activeTab={activeTab} returnUrl={returnUrl}>
      {children}
    </AccountSubscriptionEditBase>
  )
}


export default withTranslation()(withRouter(AccountSubscriptionEditPauseBase))