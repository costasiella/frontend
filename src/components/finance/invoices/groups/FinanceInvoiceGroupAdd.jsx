import React from 'react'
import { useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_INVOICE_GROUPS_QUERY, ADD_INVOICE_GROUP } from './queries'
import { INVOICE_GROUP_SCHEMA } from './yupSchema'

import {
  Card,
} from "tabler-react"

import FinanceInvoiceGroupsBase from './FinanceInvoiceGroupsBase';
import FinanceInvoiceGroupForm from './FinanceInvoiceGroupForm'


function FinanceInvoiceGroupAdd({ t, history }) {
  const returnUrl = "/finance/invoices/groups"
  const [addInvoiceGroup] = useMutation(ADD_INVOICE_GROUP)

  return (
    <FinanceInvoiceGroupsBase showBack={true}>
      <Card title={t('finance.invoice_groups.title_add')}>
        <Formik
          initialValues={{ 
            name: '', 
            displayPublic: true,
            dueAfterDays: 30,
            prefix: 'INV',
            prefixYear: true,
            autoResetPrefixYear: true,
            terms: '',
            footer: '',
            code: '' 
          }}
          validationSchema={INVOICE_GROUP_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              addInvoiceGroup({ variables: {
                input: {
                  name: values.name, 
                  displayPublic: values.displayPublic,
                  dueAfterDays: values.dueAfterDays,
                  prefix: values.prefix,
                  prefixYear: values.prefixYear,
                  autoResetPrefixYear: values.autoResetPrefixYear,
                  terms: values.terms,
                  footer: values.footer,
                  code: values.code
                }
              }, refetchQueries: [
                  {query: GET_INVOICE_GROUPS_QUERY, variables: {"archived": false }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data);
                  history.push(returnUrl)
                  toast.success((t('finance.invoice_groups.toast_add_success')), {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                }).catch((error) => {
                  toast.error((t('general.toast_server_error')) +  error, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  console.log('there was an error sending the query', error)
                  setSubmitting(false)
                })
          }}
          >
          {({ isSubmitting, values, errors, setFieldValue, setFieldTouched }) => (
            <FinanceInvoiceGroupForm 
              isSubmitting={isSubmitting}
              errors={errors}
              values={values}
              returnUrl={returnUrl}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
            />
          )}
        </Formik>
      </Card>
    </FinanceInvoiceGroupsBase>
  )
}


export default withTranslation()(withRouter(FinanceInvoiceGroupAdd))