import React, { useContext } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import moment from 'moment'
import { Link } from 'react-router-dom'

import {
  Button,
  Card,
  Grid,
  Icon,
} from "tabler-react";

import AppSettingsContext from '../../../../context/AppSettingsContext'
// import SubscriptionCheckinButton from "./ScheduleClassBookSubscriptionBtn"


function ScheduleClassEnrollSubscriptions({ 
  t, 
  match, 
  history, 
  subscriptions
}) {
  const classId = match.params.class_id
  const accountId = match.params.account_id

  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat

  return (
    subscriptions.map((subscription) =>(
      <Grid.Col md={4}>
        {console.log(subscription)}
        <Card 
          statusColor="blue"
          title={t("general.subscription")} >
        <Card.Body>
          <b>{subscription.accountSubscription.organizationSubscription.name}</b><br />
          <span className="text-muted">
            {moment(subscription.dateStart).format(dateFormat)}
          </span>
        </Card.Body>
        <Card.Footer>
          {(!subscription.allowed) ? t('schedule.classes.class.enroll.subscription_not_allowed') :
            <Link to={`/schedule/classes/all/enrollments/${classId}/add/${accountId}/${subscription.accountSubscription.id}`}>
              <Button 
                block 
                outline 
                color="success" 
              >
                {t("general.enroll")} <Icon name="chevron-right" />
              </Button>
            </Link>
          }
        </Card.Footer>
        </Card>
      </Grid.Col>
    ))
  )
}


export default withTranslation()(withRouter(ScheduleClassEnrollSubscriptions))

