// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import {
  Card,
} from "tabler-react"
import CheckoutCardDirectDebitForm from "./CheckoutCardDirectDebitForm"
import { ACCOUNT_SUBSCRIPTION_SCHEMA } from "./yupSchemaDirectDebit"


import { dateToLocalISO } from "../../../tools/date_tools"
import { CREATE_ACCOUNT_SUBSCRIPTION } from "../../relations/accounts/subscriptions/queries"


function CheckoutDirectDebit({ t, match, history, accountId, organizationSubscription }) {
  const [createSubscription] = useMutation(CREATE_ACCOUNT_SUBSCRIPTION)

  return (
    <Card title={t("shop.checkout.title")}>
      <Card.Body>
        {/* <p>{t("shop.subscription.bank_account_required_explanation")}</p> */}
        <div dangerouslySetInnerHTML={{ __html: organizationSubscription.termsAndConditions}} />
        <Formik
          initialValues={{ message: "" }}
          validationSchema={ACCOUNT_SUBSCRIPTION_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              createSubscription({ variables: {
                input: {
                  organizationSubscription: organizationSubscription.id,
                  account: accountId,
                  dateStart: dateToLocalISO(values.dateStart),
                },
                // file: values.image
              }, refetchQueries: [
                  // {query: GET_CLASSTYPES_QUERY, variables: {"archived": false }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data)
                  console.log('good...  now redirect to the subscription activated page')
                  const accountSubscriptionId = data.createAccountSubscription.accountSubscription.id
                  history.push(`/shop/subscription/direct_debit_activated/${accountSubscriptionId}`)
                }).catch((error) => {
                  toast.error((t('general.toast_server_error')) +  error, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  console.log('there was an error sending the query', error)
                  setSubmitting(false)
                })
          }}
          >
          {({ isSubmitting, errors, values, setFieldTouched, setFieldValue }) => (
            <CheckoutCardDirectDebitForm 
              isSubmitting={isSubmitting}
              errors={errors}
              values={values}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
            />
          )}
        </Formik>
      </Card.Body>
    </Card>
  )
}


export default withTranslation()(withRouter(CheckoutDirectDebit))

