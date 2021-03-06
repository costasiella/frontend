import React from 'react'
import { withTranslation } from 'react-i18next'

import {
  Badge
} from "tabler-react";

function SubscriptionCreditsMutationType({ t, mutationType }) {
  switch (mutationType) {
    case "ADD":  
      return <Badge color="success">+</Badge>
    case "SUB":
      return <Badge color="secondary">-</Badge>
    default:
      return ""
  }
}

export default withTranslation()(SubscriptionCreditsMutationType)
