import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import ButtonBack from '../../../ui/ButtonBack'


function ScheduleEventSubscriptionGroupDiscountBack({ t, match }) {
  const eventId = match.params.event_id
  const returnUrl = `/schedule/events/edit/${eventId}/subscription_group_discounts`

  return (
    <ButtonBack returnUrl={returnUrl} />
  )
}


export default withTranslation()(withRouter(ScheduleEventSubscriptionGroupDiscountBack))