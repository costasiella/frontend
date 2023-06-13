import React from 'react'
import { useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_ACCOUNT_SUBSCRIPTION_QUERY } from "../../queries"
import { GET_ACCOUNT_SUBSCRIPTION_CREDITS_QUERY, ADD_ACCOUNT_SUBSCRIPTION_CREDIT } from "./queries"
import { ACCOUNT_SUBSCRIPTION_CREDIT_ADD_SCHEMA } from './yupSchema'

import AccountSubscriptionEditCreditBase from "./AccountSubscriptionEditCreditBase"
import AccountSubscriptionEditCreditAddForm from "./AccountSubscriptionEditCreditAddForm"


function AccountSubscriptionEditCreditAdd({ t, history, match }) {
  const accountId = match.params.account_id
  const subscriptionId = match.params.subscription_id
  const returnUrl = `/relations/accounts/${accountId}/subscriptions/edit/${subscriptionId}/credits/`

  const [addSubscriptionCredit] = useMutation(ADD_ACCOUNT_SUBSCRIPTION_CREDIT, {
    onCompleted: () => history.push(returnUrl),
  })

  return (
    <AccountSubscriptionEditCreditBase>
      <Formik
        initialValues={{ 
          amount: 1,
          description: ""
        }}
        validationSchema={ACCOUNT_SUBSCRIPTION_CREDIT_ADD_SCHEMA}
        onSubmit={(values, { setSubmitting }) => {
          console.log("submit values")
          console.log(values)

          addSubscriptionCredit({ variables: {
            input: {
              accountSubscription: subscriptionId,
              amount: parseInt(values.amount),
              description: values.description
            }
          }, refetchQueries: [
              {query: GET_ACCOUNT_SUBSCRIPTION_CREDITS_QUERY, variables: {
                accountSubscription: subscriptionId
              }},
              {query: GET_ACCOUNT_SUBSCRIPTION_QUERY, variables: {
                accountId: accountId,
                id: subscriptionId
              }}
          ]})
          .then(({ data }) => {
              console.log('got data', data);
              toast.success((t('relations.account.subscriptions.credits.toast_add_success')), {
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
        {({ isSubmitting, errors, values }) => (
          <AccountSubscriptionEditCreditAddForm
            isSubmitting={isSubmitting}
            errors={errors}
            values={values}
            returnUrl={returnUrl}
          />
        )}
      </Formik>
    </AccountSubscriptionEditCreditBase>
  )
}


export default withTranslation()(withRouter(AccountSubscriptionEditCreditAdd))