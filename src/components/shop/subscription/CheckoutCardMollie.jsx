import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { useMutation } from '@apollo/client'
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import {
  Card,
} from "tabler-react"

import ShopCheckoutForm from "../ShopCheckoutForm"
import { CREATE_ORDER } from "../queries"


function CheckoutCardMollie({ t, match, history, organizationSubscriptionId }) {
  const [createOrder] = useMutation(CREATE_ORDER)

  return (
    <Card title={t("shop.checkout.title")}>
      <Card.Body>
        <Formik
          initialValues={{ message: "" }}
          // validationSchema={CLASSTYPE_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {

              let createOrderInput = {
                message: values.message,
                organizationSubscription: organizationSubscriptionId,
              }

              createOrder({ variables: {
                input: createOrderInput,
                // file: values.image
              }, refetchQueries: [
                  // {query: GET_CLASSTYPES_QUERY, variables: {"archived": false }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data)
                  console.log('good...  now redirect to the payment page')
                  const orderId = data.createFinanceOrder.financeOrder.id
                  history.push('/shop/checkout/payment/' + orderId)
                }).catch((error) => {
                  toast.error((t('general.toast_server_error')) +  error, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  console.log('there was an error sending the query', error)
                  setSubmitting(false)
                })
          }}
          >
          {({ isSubmitting, errors, values }) => (
            <ShopCheckoutForm 
              isSubmitting={isSubmitting}
              errors={errors}
              values={values}
            />
          )}
        </Formik>
      </Card.Body>
    </Card>
  )
}


export default withTranslation()(withRouter(CheckoutCardMollie))

