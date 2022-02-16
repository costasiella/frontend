import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import {
  Badge
} from "tabler-react";


class FinanceOrderStatus extends Component {
  constructor(props) {
    super(props)
    console.log("finance order status props:")
    console.log(props)
  }

  // ('RECEIVED', _("Received")),
  // ('AWAITING_PAYMENT', _("Awaiting payment")),
  // ('PAID', _("Paid")),
  // ('DELIVERED', _("Delivered")),
  // ('CANCELLED', _("Cancelled")),

  render() {
    const t = this.props.t
    const status = this.props.status

    switch (status) {
      case "RECEIVED":
        return <Badge color="secondary">{t('finance.orders.statuses.RECEIVED')}</Badge>
      case "AWAITING_PAYMENT":
        return <Badge color="primary">{t('finance.orders.statuses.AWAITING_PAYMENT')}</Badge>
      case "PAID":
        return <Badge color="success">{t('finance.orders.statuses.PAID')}</Badge>
      case "DELIVERED":
        return <Badge color="success">{t('finance.orders.statuses.DELIVERED')}</Badge>
      case "CANCELLED":
        return <Badge color="warning">{t('finance.orders.statuses.CANCELLED')}</Badge>
      default:
        return t('finance.orders.statuses.NOT_FOUND') 
    }
  }
}


export default withTranslation()(withRouter(FinanceOrderStatus))