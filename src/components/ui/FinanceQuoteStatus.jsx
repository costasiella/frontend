import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Badge
} from "tabler-react";


class FinanceQuoteStatus extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const t = this.props.t
    const status = this.props.status

    switch (status) {
      case "ALL":
        return <Badge color="secondary">{t('finance.invoices.status.ALL')}</Badge>
      case "DRAFT":
        return <Badge color="secondary">{t('finance.invoices.status.DRAFT')}</Badge>
      case "SENT":
        return <Badge color="primary">{t('finance.invoices.status.SENT')}</Badge>
      case "ACCEPTED":
        return <Badge color="success">{t('finance.invoices.status.ACCEPTED')}</Badge>
      case "REJECTED":
        return <Badge color="danger">{t('finance.invoices.status.REJECTED')}</Badge>
      case "CANCELLED":
        return <Badge color="warning">{t('finance.invoices.status.CANCELLED')}</Badge>
      default:
        return t('finance.invoices.status.NOT_FOUND') 
    }
  }
}


export default withTranslation()(withRouter(FinanceQuoteStatus))