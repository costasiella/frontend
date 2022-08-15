import React from 'react'
import { useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"
import { Formik } from 'formik'
import { toast } from 'react-toastify'


import {
  Button,
  Card,
  Icon
} from "tabler-react"


import { get_list_query_variables } from "../tools"
import { UPDATE_INVOICE, GET_INVOICE_QUERY, GET_INVOICES_QUERY } from "../queries"


function FinanceInvoiceEditTo({ t, history, match, financeInvoice }) {
  const id = match.params.id
  // const [ updateInvoice ] = useMutation(UPDATE_INVOICE)

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

          {/* {(organization.address) ?
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(organization.address)}} />
            : ""
          }      
          <div>
            {organization.phone}
          </div>
          <div>
            {organization.email}
          </div>
          <div>
            {organization.registration}
          </div>
          <div>
            {organization.taxRegistration} 
          </div> */}
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