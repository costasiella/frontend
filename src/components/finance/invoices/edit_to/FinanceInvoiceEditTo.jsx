import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import {
  Card, 
  Grid,
  Page
} from "tabler-react"


import { get_list_query_variables } from "../tools"
import { UPDATE_INVOICE, GET_INVOICE_QUERY, GET_INVOICES_QUERY } from "../queries"
import FinanceInvoiceEditToBase from "./FinanceInvoiceEditToBase"
import FinanceInvoiceEditToForm from "./FinanceInvoiceEditToForm"


function FinanceInvoiceEditTo({ t, history, match }) {
  const id = match.params.id
  const returnUrl = `/finance/invoices/edit/${id}`
  const { loading, error, data, refetch } = useQuery(GET_INVOICE_QUERY, {
    variables: {
      id: id
    },
  })
  const [ updateInvoice ] = useMutation(UPDATE_INVOICE)

  // Loading
  if (loading) return <FinanceInvoiceEditToBase>{t('general.loading_with_dots')}</FinanceInvoiceEditToBase>
  // Error
  if (error) {
    console.log(error)
    return <FinanceInvoiceEditToBase>{t('general.error_sad_smiley')}</FinanceInvoiceEditToBase>
  }

  console.log(data)
    
  let initialBusiness = ""
  if (data.financeInvoice.business) {
    initialBusiness = data.financeInvoice.business.id
  }

  return (
    <FinanceInvoiceEditToBase invoiceNumber={data.financeInvoice.invoiceNumber} >
      <Card title={t('general.to')} statusColor="blue">
        <Formik
          initialValues={{ 
            customTo: data.financeInvoice.customTo,
            relationCompany: data.financeInvoice.relationCompany, 
            relationCompanyRegistration: data.financeInvoice.relationCompanyRegistration, 
            relationCompanyTaxRegistration: data.financeInvoice.relationCompanyTaxRegistration, 
            relationContactName: data.financeInvoice.relationContactName, 
            relationAddress: data.financeInvoice.relationAddress, 
            relationPostcode: data.financeInvoice.relationPostcode, 
            relationCity: data.financeInvoice.relationCity, 
            relationCountry: data.financeInvoice.relationCountry, 
            business: initialBusiness
          }}
          // validationSchema={INVOICE_GROUP_SCHEMA}
          onSubmit={(values, { setSubmitting, setTouched }) => {
            console.log('submit values:')
            console.log(values)

            updateInvoice({ variables: {
              input: {
                id: match.params.id,
                customTo: values.customTo,
                relationCompany: values.relationCompany,
                relationCompanyRegistration: values.relationCompanyRegistration,
                relationCompanyTaxRegistration: values.relationCompanyTaxRegistration,
                relationContactName: values.relationContactName,
                relationAddress: values.relationAddress,
                relationPostcode: values.relationPostcode,
                relationCity: values.relationCity,
                relationCountry: values.relationCountry,
                business: values.business
              }
            }, refetchQueries: [
                {query: GET_INVOICE_QUERY, variables: {id:id}},
                {query: GET_INVOICES_QUERY, variables: get_list_query_variables()}
            ]})
            .then(({ data }) => {
                console.log('got data', data)
                history.push(returnUrl)
                toast.success((t('finance.invoice.toast_edit_to_success')), {
                    position: toast.POSITION.BOTTOM_RIGHT
                  })
                setSubmitting(false)
              }).catch((error) => {
                toast.error((t('general.toast_server_error')) +  error, {
                    position: toast.POSITION.BOTTOM_RIGHT
                  })
                console.log('there was an error sending the query', error)
                setSubmitting(false)
              })
            }}
        >
          {({ isSubmitting, errors, values, touched, handleChange, setFieldTouched, setFieldValue }) => (
            <FinanceInvoiceEditToForm
              isSubmitting={isSubmitting}
              errors={errors}
              values={values}
              touched={touched}
              handleChange={handleChange}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
              inputData={data}
              returnUrl={returnUrl}
            >
            </FinanceInvoiceEditToForm>
          )}
        </Formik>
      </Card>
    </FinanceInvoiceEditToBase>
  )
}


export default withTranslation()(withRouter(FinanceInvoiceEditTo))