import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"


import {
  Badge
} from "tabler-react";


class FinanceInvoicesStatus extends Component {
  constructor(props) {
    super(props)
    console.log("finance costcenter edit props:")
    console.log(props)
  }

  render() {
    const t = this.props.t
    const status = this.props.status

    switch (status) {
      case "DRAFT":
        return <Badge color="secondary">{t('finance.invoices.status.DRAFT')}</Badge>
      case "SENT":
        return <Badge color="primary">{t('finance.invoices.status.SENT')}</Badge>
      case "PAID":
        return <Badge color="success">{t('finance.invoices.status.PAID')}</Badge>
      case "CANCELLED":
        return <Badge color="warning">{t('finance.invoices.status.CANCELLED')}</Badge>
      default:
        return t('finance.invoices.status.NOT_FOUND') 
    }
  }
}


export default withTranslation()(withRouter(FinanceInvoicesStatus))