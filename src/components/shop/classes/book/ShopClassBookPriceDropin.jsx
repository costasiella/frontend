// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Card,
  Grid,
} from "tabler-react";

import ShopClassBookPriceBtn from './ShopClassBookPriceBtn'

function ShopClassBookPriceDropin({ 
  t, 
  match, 
  history, 
  priceDropin
}) {

  return (
    <Grid.Col xs={12} sm={6} md={4} xl={3}>
      <Card 
        statusColor="blue"
        title={t("general.dropin")} >
      <Card.Body>
        <b>{priceDropin.priceDisplay}</b><br />
        {t("shop.classes.book.dropin_pay_and_book")} <br />
      </Card.Body>
      <Card.Footer>
        <ShopClassBookPriceBtn price={priceDropin} />
      </Card.Footer>
      </Card>
    </Grid.Col>
  )
}


export default withTranslation()(withRouter(ShopClassBookPriceDropin))

