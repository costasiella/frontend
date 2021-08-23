import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_PAYMENT_METHODS_QUERY, GET_PAYMENT_METHOD_QUERY, UPDATE_PAYMENT_METHOD } from './queries'
import { PAYMENT_METHOD_SCHEMA } from './yupSchema'

import {
  Card,
  Dimmer,
} from "tabler-react";

import ContentCard from "../../general/ContentCard"
import FinancePaymentMethodsBase from './FinancePaymentMethodsBase';
import FinancePaymentMethodForm from './FinancePaymentMethodForm'


function FinancePaymentMethodEdit({ t, history, match }) {
  const id = match.params.id
  const cardTitle = t('finance.payment_methods.title_edit')
  const returnUrl = "/finance/paymentmethods"

  const { loading, error, data } = useQuery(GET_PAYMENT_METHOD_QUERY, {
    variables: { id: id }
  })
  const [ updatePaymentMethod ] = useMutation(UPDATE_PAYMENT_METHOD)

  if (loading) return (
    <FinancePaymentMethodsBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </FinancePaymentMethodsBase>
  )

  if (error) return (
    <FinancePaymentMethodsBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('general.error_sad_smiley')}</p>
      </ContentCard>
    </FinancePaymentMethodsBase>
  )

  const initialData = data.financePaymentMethod;
  console.log('query data')
  console.log(data)

  return (
    <FinancePaymentMethodsBase showBack={true}>
      <Card title={cardTitle}>
        <Formik
          initialValues={{ 
            name: initialData.name, 
            code: initialData.code
          }}
          validationSchema={PAYMENT_METHOD_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              console.log('submit values:')
              console.log(values)

              updatePaymentMethod({ variables: {
                input: {
                  id: match.params.id,
                  name: values.name,
                  code: values.code
                }
              }, refetchQueries: [
                  {query: GET_PAYMENT_METHODS_QUERY, variables: {"archived": false }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data)
                  history.push(returnUrl)
                  toast.success((t('finance.payment_methods.toast_edit_success')), {
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
          {({ isSubmitting, errors, values }) => (
              <FinancePaymentMethodForm
                isSubmitting={isSubmitting}
                errors={errors}
                values={values}
                returnUrl={returnUrl}
              />
          )}
        </Formik>
      </Card>
    </FinancePaymentMethodsBase>
  )
}


export default withTranslation()(withRouter(FinancePaymentMethodEdit))