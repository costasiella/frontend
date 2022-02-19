import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Grid,
  Card,
} from "tabler-react";

import ScheduleClassBookPriceBtn from "./ScheduleClassBookPriceBtn"

function ScheduleClassBookPriceDropin({ 
  t, 
  match, 
  history, 
  priceDropin, 
  locationId,
  onClickCheckin=f=>f,
  returnTo="schedule_classes"
}) {
  console.log('priceDropin')
  console.log(priceDropin)

  return (
    <Grid.Col md={3}>
      <Card 
        statusColor="blue"
        title={t("general.dropin")} >
      <Card.Body>
        <b>{priceDropin.priceDisplay}</b><br />
        {t("schedule.classes.class.book.dropin_pay_and_book")} <br />
      </Card.Body>
      <Card.Footer>
        <ScheduleClassBookPriceBtn price={priceDropin} returnTo={returnTo} locationID={locationId} />
      </Card.Footer>
      </Card>
    </Grid.Col>
  )
}


export default withTranslation()(withRouter(ScheduleClassBookPriceDropin))

