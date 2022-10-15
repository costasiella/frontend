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
        return <Badge color="secondary">{t('finance.quotes.status.ALL')}</Badge>
      case "DRAFT":
        return <Badge color="secondary">{t('finance.quotes.status.DRAFT')}</Badge>
      case "SENT":
        return <Badge color="primary">{t('finance.quotes.status.SENT')}</Badge>
      case "ACCEPTED":
        return <Badge color="success">{t('finance.quotes.status.ACCEPTED')}</Badge>
      case "REJECTED":
        return <Badge color="danger">{t('finance.quotes.status.REJECTED')}</Badge>
      case "CANCELLED":
        return <Badge color="warning">{t('finance.quotes.status.CANCELLED')}</Badge>
      default:
        return t('finance.quotes.status.NOT_FOUND') 
    }
  }
}


export default withTranslation()(withRouter(FinanceQuoteStatus))