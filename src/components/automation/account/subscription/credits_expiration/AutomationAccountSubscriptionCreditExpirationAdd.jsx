// @flow

import React from 'react'
import { useMutation } from "@apollo/client"
import { gql } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'


import { GET_TASK_RESULT_QUERY } from "../../../queries"
// import { AUTOMATION_ACCOUNT_SUBSCRIPTION_CREDIT_SCHEMA } from './yupSchema'
import AutomationAccountSubscriptionCreditExpirationForm from './AutomationAccountSubscriptionCreditExpirationForm'


import {
  Card,
} from "tabler-react"
// import SiteWrapper from "../../SiteWrapper"
// import HasPermissionWrapper from "../../HasPermissionWrapper"

import AutomationAccountSubscriptionCreditExpirationBase from './AutomationAccountSubscriptionCreditExpirationBase'


const ADD_TASK = gql`
  mutation CreateAccountSubscriptionCreditForMonth($input:CreateAccountSubscriptionCreditForMonthInput!) {
    createAccountSubscriptionCreditForMonth(input: $input) {
      ok
    }
  }
`


function AutomationAccountSubscriptionCreditExpirationAdd({ t, history }) {
  const [addTask] = useMutation(ADD_TASK)
  const returnUrl = "/automation/account/subscriptions/credits_expiration"

  return (
    <AutomationAccountSubscriptionCreditExpirationBase returnUrl={returnUrl}>
      <Card>
        <Card.Header>
          <Card.Title>{t('automation.account.subscriptions.credits_expiration.title_add')}</Card.Title>
        </Card.Header>
        <Formik
          // initialValues={}
          // validationSchema={AUTOMATION_ACCOUNT_SUBSCRIPTION_CREDIT_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              addTask({ refetchQueries: [
                {query: GET_TASK_RESULT_QUERY, 
                  variables: {
                    taskName: "costasiella.tasks.account.subscription.credits.tasks.account_subscription_credits_add_for_month"
                }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data)
                  history.push(returnUrl)
                  toast.success((t('automation.account.subscriptions.credits_expiration.toast_add_success')), {
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
          {({ isSubmitting, errors }) => (
              <AutomationAccountSubscriptionCreditExpirationForm 
                isSubmitting={isSubmitting}
                errors={errors}
                returnUrl={returnUrl}
              />
          )}
        </Formik>
      </Card>
    </AutomationAccountSubscriptionCreditExpirationBase>
  )
}

export default withTranslation()(withRouter(AutomationAccountSubscriptionCreditExpirationAdd))