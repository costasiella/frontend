import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"

import {
  Button,
  Card,
} from "tabler-react"


function FinanceQuoteEditTo({ t, history, match, financeQuote }) {
  const id = match.params.id

  return (
    <Card statusColor="blue">
      <Card.Header>
        <Card.Title>{t('general.to')} </Card.Title>
        <Card.Options>
          <Link to={`/finance/quotes/edit/${id}/to`}>
            <Button color="secondary" size="sm">
              {t('general.edit')}
            </Button>
          </Link> 
        </Card.Options>
      </Card.Header>
      <Card.Body>
        <div className='mb-3'>
          <div className="bold">
            {financeQuote.relationCompany}
          </div>
          <div>
            {financeQuote.relationCompanyRegistration}
          </div>
          <div>
            {financeQuote.relationCompanyTaxRegistration}
          </div>
        </div>
          <div className="bold">
            {financeQuote.relationContactName}
          </div>
          <div>
            {financeQuote.relationAddress}
          </div>
          <div>
            {financeQuote.relationPostcode} {financeQuote.relationCity}
          </div>
          <div>
            {financeQuote.relationCountry}
          </div>
      </Card.Body>
      <Card.Footer>
        {(financeQuote.business) && <span className='float-right'>
          <Link to={`/relations/b2b/${financeQuote.business.id}/edit`}>
            <Button icon="home" color="link">
              {financeQuote.business.name}
            </Button> 
          </Link>
          </span>}
        {(financeQuote.account) && <Link to={`/relations/accounts/${financeQuote.account.id}/profile`}>
          <Button icon="user" color="link">
            {financeQuote.account.fullName}
          </Button> 
        </Link>}
      </Card.Footer>
    </Card>
  )
}

export default withTranslation()(withRouter(FinanceQuoteEditTo))
