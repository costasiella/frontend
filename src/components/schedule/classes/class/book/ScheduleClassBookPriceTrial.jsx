import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Grid,
  Card,
} from "tabler-react";

import ScheduleClassBookPriceBtn from "./ScheduleClassBookPriceBtn"


function ScheduleClassBookPriceTrial({ 
  t, 
  match, 
  history, 
  priceTrial, 
  locationId,
  onClickCheckin=f=>f,
  returnTo="schedule_classes"
}) {
  console.log('priceTrial')
  console.log(priceTrial)

  return (
    <Grid.Col xs={12} sm={6} md={3}>
      <Card 
        statusColor="blue"
        title={t("general.trial")} >
      <Card.Body>
        <b>{priceTrial.priceDisplay}</b><br />
        {t("schedule.classes.class.book.trial_pay_and_book")} <br />
      </Card.Body>
      <Card.Footer>
        <ScheduleClassBookPriceBtn price={priceTrial} returnTo={returnTo} locationId={locationId} />
      </Card.Footer>
      </Card>
    </Grid.Col>
  )
}


export default withTranslation()(withRouter(ScheduleClassBookPriceTrial))

