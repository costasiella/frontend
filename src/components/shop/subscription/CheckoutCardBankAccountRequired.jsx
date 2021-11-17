// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"

import {
  Button,
  Card,
  Icon,
} from "tabler-react"


function CheckoutCardBankAccountRequired({ t, match, history }) {

  return (
    <Card title={t("shop.subscription.bank_account_required")}>
      <Card.Body>
        {t("shop.subscription.bank_account_required_explanation")}
      </Card.Body>
      <Card.Footer>
      <Link to="/shop/account/bank_account">
        <Button 
          block
          color="primary"
          className="pull-right" 
          type="submit" 
        >
          {t('shop.subscription.to_bank_account')} <Icon name="chevron-right" />
        </Button>
      </Link>
      </Card.Footer>
    </Card>
  )
}


export default withTranslation()(withRouter(CheckoutCardBankAccountRequired))

