import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import {
  Card, 
} from "tabler-react"

import { get_list_query_variables } from "../tools"
import { UPDATE_QUOTE, GET_QUOTE_QUERY, GET_QUOTES_QUERY } from "../queries"
import FinanceQuoteEditToBase from "./FinanceQuoteEditToBase"
import FinanceQuoteEditToForm from "./FinanceQuoteEditToForm"


function FinanceQuoteEditTo({ t, history, match }) {
  const id = match.params.id
  const returnUrl = `/finance/quotes/edit/${id}`
  const { loading, error, data } = useQuery(GET_QUOTE_QUERY, {
    variables: {
      id: id
    },
  })
  const [ updateQuote ] = useMutation(UPDATE_QUOTE)

  // Loading
  if (loading) return <FinanceQuoteEditToBase>{t('general.loading_with_dots')}</FinanceQuoteEditToBase>
  // Error
  if (error) {
    console.log(error)
    return <FinanceQuoteEditToBase>{t('general.error_sad_smiley')}</FinanceQuoteEditToBase>
  }

  console.log(data)
    
  let initialBusiness = ""
  if (data.financeQuote.business) {
    initialBusiness = data.financeQuote.business.id
  }

  return (
    <FinanceQuoteEditToBase quoteNumber={data.financeQuote.quoteNumber} >
      <Card title={t('general.to')} statusColor="blue">
        <Formik
          initialValues={{ 
            customTo: data.financeQuote.customTo,
            relationCompany: data.financeQuote.relationCompany, 
            relationCompanyRegistration: data.financeQuote.relationCompanyRegistration, 
            relationCompanyTaxRegistration: data.financeQuote.relationCompanyTaxRegistration, 
            relationContactName: data.financeQuote.relationContactName, 
            relationAddress: data.financeQuote.relationAddress, 
            relationPostcode: data.financeQuote.relationPostcode, 
            relationCity: data.financeQuote.relationCity, 
            relationCountry: data.financeQuote.relationCountry, 
            business: initialBusiness
          }}
          // validationSchema={QUOTE_GROUP_SCHEMA}
          onSubmit={(values, { setSubmitting, setTouched }) => {
            console.log('submit values:')
            console.log(values)

            updateQuote({ variables: {
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
                {query: GET_QUOTE_QUERY, variables: {id:id}},
                {query: GET_QUOTES_QUERY, variables: get_list_query_variables()}
            ]})
            .then(({ data }) => {
                console.log('got data', data)
                history.push(returnUrl)
                toast.success((t('finance.quote.toast_edit_to_success')), {
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
            <FinanceQuoteEditToForm
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
            </FinanceQuoteEditToForm>
          )}
        </Formik>
      </Card>
    </FinanceQuoteEditToBase>
  )
}

export default withTranslation()(withRouter(FinanceQuoteEditTo))
