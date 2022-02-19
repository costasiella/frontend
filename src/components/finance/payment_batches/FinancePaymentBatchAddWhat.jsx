import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Card
} from "tabler-react";

import FinancePaymentBatchesBase from "./FinancePaymentBatchesBase"
import { get_add_options_collection, get_add_options_payment } from './tools'


function FinancePaymentBatchAddWhat({t, history, match }) {
  const batchType = match.params.batch_type
  const returnUrl = `/finance/paymentbatches/${batchType}`

  let cardTitle
  let options
  if (batchType === "collection") {
    cardTitle = t('finance.payment_batch_collections.title_add_what')
    options = get_add_options_collection(t, batchType)
  } else {
    cardTitle = t('finance.payment_batch_payments.title_add_what')
    options = get_add_options_payment(t, batchType)
  }

  return (
    <FinancePaymentBatchesBase showBack={true} returnUrl={returnUrl}>
      <Card>
        <Card.Header>
          <Card.Title>{cardTitle}</Card.Title>
        </Card.Header>
        <Card.Body>
          {options}
        </Card.Body>
      </Card>
    </FinancePaymentBatchesBase>
  )
}

export default withTranslation()(withRouter(FinancePaymentBatchAddWhat))