// This file is closely related to shop > checkout > payment > ShopCheckoutPayment.jsx
// They should have the same error messages when more account info is required.

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"

import {
  Alert,
  Button,
  Card,
  Icon,
} from "tabler-react"


function CheckoutCardDirectDebitAccountInfoRequired({ t, match, history }) {

  return (
    <Card title={t("shop.subscription.bank_account_required")}>
      <Card.Body>
        <Alert type="primary">
          {t("shop.checkout.payment.profile_not_complete_enough")}
        </Alert>
      </Card.Body>
      <Card.Footer>
      <Link to="/shop/account/profile">
        <Button 
          block
          color="primary"
          className="pull-right" 
          type="submit" 
        >
          {t("shop.checkout.payment.update_profile")} <Icon name="chevron-right" />
        </Button>
      </Link>
      </Card.Footer>
    </Card>
  )
}


export default withTranslation()(withRouter(CheckoutCardDirectDebitAccountInfoRequired))

