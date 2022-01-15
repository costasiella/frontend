import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Grid,
  Card,
} from "tabler-react";

import SubscriptionCheckinButton from "./ScheduleClassBookSubscriptionBtn"


function ScheduleClassBookSubscriptions({ 
  t, 
  match, 
  history, 
  subscriptions, 
  locationId,
  returnTo="schedule_classes"
}) {

  return (
    subscriptions.map((subscription) =>(
      <Grid.Col md={3}>
        <Card 
          statusColor="blue"
          title={t("general.subscription")} >
        <Card.Body>
          <b>{subscription.accountSubscription.organizationSubscription.name}</b><br />
          <span className="text-muted">
            {t("general.credits_remaining")}: {subscription.accountSubscription.creditTotal}
          </span>
        </Card.Body>
        <Card.Footer>
          {(!subscription.allowed) ? t('schedule.classes.class.book.subscription_not_allowed') :
            <SubscriptionCheckinButton subscription={subscription} returnTo={returnTo} locationId={locationId} />
          }
        </Card.Footer>
        </Card>
      </Grid.Col>
    ))
  )
}


export default withTranslation()(withRouter(ScheduleClassBookSubscriptions))

