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
import { UPDATE_QUOTE, GET_QUOTES_QUERY } from "../queries"
import FinanceQuoteEditOptionsForm from "./FinanceQuoteEditOptionsForm"


function FinanceQuoteEditOptions({t, match, initialData}) {
  const [ updateQuote ] = useMutation(UPDATE_QUOTE)
  
  // DatePicker doesn't like a string as an initial value
  // This makes it a happy DatePicker :)
  let dateSent = null
  if (initialData.financeQuote.dateSent) {
    dateSent = new Date(initialData.financeQuote.dateSent)
  }
  let dateExpire = null
  if (initialData.financeQuote.dateExpire) {
    dateExpire = new Date(initialData.financeQuote.dateExpire)
  }

  return (
    <Card title={t('general.options')} statusColor="blue">
      <Card.Body>
        <Formik
          initialValues={{ 
            quoteNumber: initialData.financeQuote.quoteNumber, 
            dateSent: dateSent,
            dateExpire: dateExpire,
            status: initialData.financeQuote.status,
            financePaymentMethod: initialPaymentMethod
          }}
          // validationSchema={QUOTE_GROUP_SCHEMA}
          onSubmit={(values, { setSubmitting, setTouched }) => {
            console.log('submit values:')
            console.log(values)

            updateQuote({ variables: {
              input: {
                id: match.params.id,
                quoteNumber: values.quoteNumber, 
                dateSent: dateToLocalISO(values.dateSent),
                dateExpire: dateToLocalISO(values.dateExpire),
                status: values.status,
              }
            }, refetchQueries: [
                {query: GET_QUOTES_QUERY, variables: get_list_query_variables()}
            ]})
            .then(({ data }) => {
                console.log('got data', data)
                toast.success((t('finance.quote.toast_edit_options_success')), {
                    position: toast.POSITION.BOTTOM_RIGHT
                  })
                setSubmitting(false)
                setTouched({})
              }).catch((error) => {
                toast.error((t('general.toast_server_error')) +  error, {
                    position: toast.POSITION.BOTTOM_RIGHT
                  })
                console.log('there was an error sending the query', error)
                setSubmitting(false)
              })
            }}
        >
          {({ isSubmitting, errors, values, touched, handleChange, submitForm, setFieldTouched, setFieldValue }) => (
            <FinanceQuoteEditOptionsForm
              inputData={initialData}
              isSubmitting={isSubmitting}
              errors={errors}
              values={values}
              touched={touched}
              handleChange={handleChange}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
            >
            </FinanceQuoteEditOptionsForm>
          )}
        </Formik>
      </Card.Body>
    </Card>
  )
}


export default withTranslation()(withRouter(FinanceQuoteEditOptions))