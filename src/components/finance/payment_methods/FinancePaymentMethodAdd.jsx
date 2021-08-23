// @flow

import React from 'react'
import { useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'


import { GET_PAYMENT_METHODS_QUERY, ADD_PAYMENT_METHOD } from './queries'
import { PAYMENT_METHOD_SCHEMA } from './yupSchema'


import {
  Page,
  Grid,
  Icon,
  Button,
  Card,
  Container,
} from "tabler-react"
import SiteWrapper from "../../SiteWrapper"
import HasPermissionWrapper from "../../HasPermissionWrapper"

import FinancePaymentMethodsBase from './FinancePaymentMethodsBase';
import FinancePaymentMethodForm from './FinancePaymentMethodForm'


function FinancePaymentMethodAdd({ t, history }) {
  const returnUrl = "/finance/paymentmethods"
  const [ addPaymentMethod ] = useMutation(ADD_PAYMENT_METHOD)

  return (
    <FinancePaymentMethodsBase showBack={true}>
      <Card title={t('finance.payment_methods.title_add')}>
        <Formik
          initialValues={{ name: '', code: '' }}
          validationSchema={PAYMENT_METHOD_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              addPaymentMethod({ variables: {
                input: {
                  name: values.name, 
                  code: values.code
                }
              }, refetchQueries: [
                  {query: GET_PAYMENT_METHODS_QUERY, variables: {"archived": false }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data);
                  history.push(returnUrl)
                  toast.success((t('finance.payment_methods.toast_add_success')), {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                }).catch((error) => {
                  toast.error((t('general.toast_server_error')) + ': ' +  error, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  console.log('there was an error sending the query', error)
                  setSubmitting(false)
                })
          }}
          >
          {({ isSubmitting, errors }) => (
              <FinancePaymentMethodForm
                isSubmitting={isSubmitting}
                errors={errors}
                returnUrl={returnUrl}
              />
          )}
        </Formik>
      </Card>
    </FinancePaymentMethodsBase>
  )
}


export default withTranslation()(withRouter(FinancePaymentMethodAdd))