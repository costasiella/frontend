// @flow

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


import { get_list_query_variables } from "../tools"
import { UPDATE_INVOICE, GET_INVOICE_QUERY } from "../queries"
import FinanceInvoiceEditTermsForm from "./FinanceInvoiceEditTermsForm"
import FinanceInvoiceEditFooterForm from "./FinanceInvoiceEditFooterForm"
import FinanceInvoiceEditNoteForm from "./FinanceInvoiceEditNoteForm"


function FinanceInvoiceEditAdditional({t, history, match, initialData}) {
  const id = match.params.id
  const [ updateInvoice ] = useMutation(UPDATE_INVOICE)

  return (
    <TabbedCard initialTab={t('general.terms_and_conditions')}>
      <Tab title={t('general.terms_and_conditions')}>
        <Formik
          initialValues={{ 
            terms: initialData.financeInvoice.terms, 
          }}
          // validationSchema={INVOICE_GROUP_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
            console.log('submit values:')
            console.log(values)

            updateInvoice({ variables: {
              input: {
                id: match.params.id,
                terms: values.terms, 
              }
            }, refetchQueries: [
                {query: GET_INVOICE_QUERY, variables: {id: id}}
            ]})
            .then(({ data }) => {
                console.log('got data', data)
                toast.success((t('finance.invoice.toast_edit_terms_success')), {
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
            <FinanceInvoiceEditTermsForm
              isSubmitting={isSubmitting}
              errors={errors}
              values={values}
              touched={touched}
              handleChange={handleChange}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
            >
            </FinanceInvoiceEditTermsForm>
          )}
        </Formik>
      </Tab>
      <Tab title={t('general.footer')}>
        <Formik
          initialValues={{ 
            footer: initialData.financeInvoice.footer, 
          }}
          // validationSchema={INVOICE_GROUP_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
            console.log('submit values:')
            console.log(values)

            updateInvoice({ variables: {
              input: {
                id: match.params.id,
                footer: values.footer, 
              }
            }, refetchQueries: [
              {query: GET_INVOICE_QUERY, variables: {id: id}}
            ]})
            .then(({ data }) => {
                console.log('got data', data)
                toast.success((t('finance.invoice.toast_edit_footer_success')), {
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
            <FinanceInvoiceEditFooterForm
              isSubmitting={isSubmitting}
              errors={errors}
              values={values}
              handleChange={handleChange}
              touched={touched}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
            >
            </FinanceInvoiceEditFooterForm>
          )}
        </Formik>
      </Tab>
      <Tab title={t('general.note')}>
        <Formik
          initialValues={{ 
            note: initialData.financeInvoice.note, 
          }}
          // validationSchema={INVOICE_GROUP_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
            console.log('submit values:')
            console.log(values)

            updateInvoice({ variables: {
              input: {
                id: match.params.id,
                note: values.note, 
              }
            }, refetchQueries: [
              {query: GET_INVOICE_QUERY, variables: {id: id}}
            ]})
            .then(({ data }) => {
                console.log('got data', data)
                toast.success((t('finance.invoice.toast_edit_note_success')), {
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
            <FinanceInvoiceEditNoteForm
              isSubmitting={isSubmitting}
              errors={errors}
              values={values}
              touched={touched}
              handleChange={handleChange}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
            >
            </FinanceInvoiceEditNoteForm>
          )}
        </Formik>
      </Tab>
    </TabbedCard>
  )
}

export default withTranslation()(withRouter(FinanceInvoiceEditAdditional))