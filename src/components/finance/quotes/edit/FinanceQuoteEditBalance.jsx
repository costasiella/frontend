import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"


import {
  Card
} from "tabler-react";


const FinanceQuoteEditBalance = ({ t, history, financeQuote }) => (
  <Card statusColor="blue">
    <Card.Header>
      <Card.Title>{t('general.balance')}</Card.Title>
    </Card.Header>
    <Card.Body>
      <div>
        <span className="pull-left bold">
          {t('general.subtotal')}
        </span>
        <span className="pull-right">
          {financeQuote.subtotalDisplay}
        </span>
      </div><br />
      <div>
        <span className="pull-left bold">
          {t('general.tax')}
        </span>
        <span className="pull-right">
          {financeQuote.taxDisplay}
        </span>
      </div><br />
      <div>
        <span className="pull-left bold">
          {t('general.total')}
        </span>
        <span className="pull-right">
          {financeQuote.totalDisplay}
        </span>
      </div><br />
      <div>
        <span className="pull-left bold">
          {t('general.paid')}
        </span>
        <span className="pull-right">
          {financeQuote.paidDisplay}
        </span>
      </div><br />
      <div>
        <span className="pull-left bold">
          {t('general.balance')}
        </span>
        <span className="pull-right">
          {financeQuote.balanceDisplay}
        </span>
      </div>
    </Card.Body>
  </Card>
)

export default withTranslation()(withRouter(FinanceQuoteEditBalance))