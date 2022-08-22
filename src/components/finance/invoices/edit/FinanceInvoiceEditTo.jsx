import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"

import {
  Button,
  Card,
} from "tabler-react"


function FinanceInvoiceEditTo({ t, history, match, financeInvoice }) {
  const id = match.params.id

  return (
    <Card statusColor="blue">
      <Card.Header>
        <Card.Title>{t('general.to')} </Card.Title>
        <Card.Options>
          <Link to={`/finance/invoices/edit/${id}/to`}>
            <Button color="secondary" size="sm">
              {t('general.edit')}
            </Button>
          </Link> 
        </Card.Options>
      </Card.Header>
      <Card.Body>
        <div className='mb-3'>
          <div className="bold">
            {financeInvoice.relationCompany}
          </div>
          <div>
            {financeInvoice.relationCompanyRegistration}
          </div>
          <div>
            {financeInvoice.relationCompanyTaxRegistration}
          </div>
        </div>
          <div className="bold">
            {financeInvoice.relationContactName}
          </div>
          <div>
            {financeInvoice.relationAddress}
          </div>
          <div>
            {financeInvoice.relationPostcode} {financeInvoice.relationCity}
          </div>
          <div>
            {financeInvoice.relationCountry}
          </div>
      </Card.Body>
      <Card.Footer>
        {(financeInvoice.business) && <span className='float-right'>
          <Link to={`/relations/b2b/${financeInvoice.business.id}/edit`}>
            <Button icon="home" color="link">
              {financeInvoice.business.name}
            </Button> 
          </Link>
          </span>}
        {(financeInvoice.account) && <Link to={`/relations/accounts/${financeInvoice.account.id}/profile`}>
          <Button icon="user" color="link">
            {financeInvoice.account.fullName}
          </Button> 
        </Link>}
      </Card.Footer>
    </Card>
  )
}


export default withTranslation()(withRouter(FinanceInvoiceEditTo))