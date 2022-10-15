import React from 'react'
import { useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import {
  Card,
} from "tabler-react"

import { get_list_query_variables } from "../tools"
import { UPDATE_QUOTE, GET_QUOTES_QUERY } from "../queries"
import FinanceQuoteEditSummaryForm from "./FinanceQuoteEditSummaryForm"


function FinanceQuoteEditSummary({t, history, match, location, initialData}) {  
  const [ updateQuote ] = useMutation(UPDATE_QUOTE)

  return (
    <Card statusColor="blue">
      <Card.Header>
        <Card.Title>{t('general.summary')}</Card.Title>
      </Card.Header>
      <Card.Body>
        <Formik
          initialValues={{ 
            summary: initialData.financeQuote.summary, 
          }}
          // validationSchema={QUOTE_GROUP_SCHEMA}
          onSubmit={(values, { setSubmitting, setTouched }) => {
            console.log('submit values:')
            console.log(values)

            updateQuote({ variables: {
              input: {
                id: match.params.id,
                summary: values.summary, 
              }
            }, refetchQueries: [
                {query: GET_QUOTES_QUERY, variables: get_list_query_variables()}
            ]})
            .then(({ data }) => {
                console.log('got data', data)
                toast.success((t('finance.quote.toast_edit_summary_success')), {
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
          {({ isSubmitting, errors, values, touched, setFieldTouched, handleChange }) => (
            <FinanceQuoteEditSummaryForm
              isSubmitting={isSubmitting}
              errors={errors}
              values={values}
              touched={touched}
              handleChange={handleChange}
              setFieldTouched={setFieldTouched}
            >
            </FinanceQuoteEditSummaryForm>
          )}
        </Formik>
      </Card.Body>
    </Card>
  )
}

export default withTranslation()(withRouter(FinanceQuoteEditSummary))
