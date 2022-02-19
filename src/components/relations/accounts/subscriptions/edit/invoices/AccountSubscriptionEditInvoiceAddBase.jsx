import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import AccountSubscriptionEditBase from "../AccountSubscriptionEditBase"


function AccountSubscriptionEditInvoiceAddBase({ t, history, match, children}) {
  const activeTab = "invoices"

  return (
    <AccountSubscriptionEditBase activeTab={activeTab}>
      {children}
    </AccountSubscriptionEditBase>
  )
}


export default withTranslation()(withRouter(AccountSubscriptionEditInvoiceAddBase))