// @flow

import React from 'react'
import { useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import {
  Card, 
} from "tabler-react"

import { dateToLocalISO } from '../../../../tools/date_tools'
import { get_list_query_variables } from "../tools"
import { UPDATE_INVOICE, GET_INVOICES_QUERY } from "../queries"
import FinanceInvoiceEditOptionsForm from "./FinanceInvoiceEditOptionsForm"


function FinanceInvoiceEditOptions({t, match, initialData}) {
  const [ updateInvoice ] = useMutation(UPDATE_INVOICE)
  
  let initialPaymentMethod = ""
  if (initialData.financeInvoice.financePaymentMethod) {
    initialPaymentMethod = initialData.financeInvoice.financePaymentMethod.id
  }

  // DatePicker doesn't like a string as an initial value
  // This makes it a happy DatePicker :)
  let dateSent = null
  if (initialData.financeInvoice.dateSent) {
    dateSent = new Date(initialData.financeInvoice.dateSent)
  }
  let dateDue = null
  if (initialData.financeInvoice.dateDue) {
    dateDue = new Date(initialData.financeInvoice.dateDue)
  }

  
  console.log("########")
  console.log(initialData)
  console.log(dateSent)
  console.log(dateDue)


  return (
    <Card title={t('general.options')} statusColor="blue">
      <Card.Body>
        <Formik
          initialValues={{ 
            invoiceNumber: initialData.financeInvoice.invoiceNumber, 
            dateSent: dateSent,
            dateDue: dateDue,
            status: initialData.financeInvoice.status,
            financePaymentMethod: initialPaymentMethod
          }}
          // validationSchema={INVOICE_GROUP_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
            console.log('submit values:')
            console.log(values)

            updateInvoice({ variables: {
              input: {
                id: match.params.id,
                invoiceNumber: values.invoiceNumber, 
                dateSent: dateToLocalISO(values.dateSent),
                dateDue: dateToLocalISO(values.dateDue),
                status: values.status,
                financePaymentMethod: values.financePaymentMethod,
              }
            }, refetchQueries: [
                {query: GET_INVOICES_QUERY, variables: get_list_query_variables()}
            ]})
            .then(({ data }) => {
                console.log('got data', data)
                toast.success((t('finance.invoice.toast_edit_options_success')), {
                    position: toast.POSITION.BOTTOM_RIGHT
                  })
                setSubmitting(false)
              }).catch((error) => {
                toast.error((t('general.toast_server_error')) + ': ' +  error, {
                    position: toast.POSITION.BOTTOM_RIGHT
                  })
                console.log('there was an error sending the query', error)
                setSubmitting(false)
              })
            }}
        >
          {({ isSubmitting, errors, values, touched, handleChange, submitForm, setFieldTouched, setFieldValue }) => (
            <FinanceInvoiceEditOptionsForm
              inputData={initialData}
              isSubmitting={isSubmitting}
              errors={errors}
              values={values}
              handleChange={handleChange}
              submitForm={submitForm}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
            >
            </FinanceInvoiceEditOptionsForm>
          )}
        </Formik>
      </Card.Body>
    </Card>
  )
}


export default withTranslation()(withRouter(FinanceInvoiceEditOptions))