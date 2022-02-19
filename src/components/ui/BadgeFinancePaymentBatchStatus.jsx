import React from 'react'
import { withTranslation } from 'react-i18next'

import {
  Badge
} from "tabler-react"


function BadgeFinancePaymentBatchStatus({ t, status }) {
  switch (status) {
    case "SENT_TO_BANK":
      return <Badge color="success">{t('finance.payment_batches.status.SENT_TO_BANK')}</Badge> 
    case "APPROVED":
      return <Badge color="success">{t('finance.payment_batches.status.APPROVED')}</Badge> 
    case "AWAITING_APPROVAL":
      return <Badge color="primary">{t('finance.payment_batches.status.AWAITING_APPROVAL')}</Badge> 
    case "REJECTED":
      return <Badge color="danger">{t('finance.payment_batches.status.REJECTED')}</Badge> 
    default:
      return t("finance.payment_batches.status.invalid_type")
  }
}

export default withTranslation()(BadgeFinancePaymentBatchStatus)
