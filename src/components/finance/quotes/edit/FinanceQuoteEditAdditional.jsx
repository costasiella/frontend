import React from 'react'
import { useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import {
  Tab,
  TabbedCard
} from "tabler-react"


import { UPDATE_QUOTE, GET_QUOTE_QUERY } from "../queries"
import FinanceQuoteEditTermsForm from "./FinanceQuoteEditTermsForm"
import FinanceQuoteEditFooterForm from "./FinanceQuoteEditFooterForm"
import FinanceQuoteEditNoteForm from "./FinanceQuoteEditNoteForm"


function FinanceQuoteEditAdditional({t, history, match, initialData}) {
  const id = match.params.id
  const [ updateQuote ] = useMutation(UPDATE_QUOTE)

  return (
    <TabbedCard initialTab={t('general.terms_and_conditions')}>
      <Tab title={t('general.terms_and_conditions')}>
        <Formik
          initialValues={{ 
            terms: initialData.financeQuote.terms, 
          }}
          // validationSchema={QUOTE_GROUP_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
            console.log('submit values:')
            console.log(values)

            updateQuote({ variables: {
              input: {
                id: match.params.id,
                terms: values.terms, 
              }
            }, refetchQueries: [
                {query: GET_QUOTE_QUERY, variables: {id: id}}
            ]})
            .then(({ data }) => {
                console.log('got data', data)
                toast.success((t('finance.quote.toast_edit_terms_success')), {
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
            <FinanceQuoteEditTermsForm
              isSubmitting={isSubmitting}
              errors={errors}
              values={values}
              touched={touched}
              handleChange={handleChange}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
            >
            </FinanceQuoteEditTermsForm>
          )}
        </Formik>
      </Tab>
      <Tab title={t('general.footer')}>
        <Formik
          initialValues={{ 
            footer: initialData.financeQuote.footer, 
          }}
          // validationSchema={QUOTE_GROUP_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
            console.log('submit values:')
            console.log(values)

            updateQuote({ variables: {
              input: {
                id: match.params.id,
                footer: values.footer, 
              }
            }, refetchQueries: [
              {query: GET_QUOTE_QUERY, variables: {id: id}}
            ]})
            .then(({ data }) => {
                console.log('got data', data)
                toast.success((t('finance.quote.toast_edit_footer_success')), {
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
            <FinanceQuoteEditFooterForm
              isSubmitting={isSubmitting}
              errors={errors}
              values={values}
              handleChange={handleChange}
              touched={touched}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
            >
            </FinanceQuoteEditFooterForm>
          )}
        </Formik>
      </Tab>
      <Tab title={t('general.note')}>
        <Formik
          initialValues={{ 
            note: initialData.financeQuote.note, 
          }}
          // validationSchema={QUOTE_GROUP_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
            console.log('submit values:')
            console.log(values)

            updateQuote({ variables: {
              input: {
                id: match.params.id,
                note: values.note, 
              }
            }, refetchQueries: [
              {query: GET_QUOTE_QUERY, variables: {id: id}}
            ]})
            .then(({ data }) => {
                console.log('got data', data)
                toast.success((t('finance.quote.toast_edit_note_success')), {
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
            <FinanceQuoteEditNoteForm
              isSubmitting={isSubmitting}
              errors={errors}
              values={values}
              touched={touched}
              handleChange={handleChange}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
            >
            </FinanceQuoteEditNoteForm>
          )}
        </Formik>
      </Tab>
    </TabbedCard>
  )
}

export default withTranslation()(withRouter(FinanceQuoteEditAdditional))