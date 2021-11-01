// @flow

import React, {useState} from 'react'
import { useMutation } from "@apollo/client"
import { gql } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

import { GET_TASK_RESULT_QUERY } from "../../../queries"

import {
  Button,
  Card,
  Grid,
  Icon
} from "tabler-react"
// import SiteWrapper from "../../SiteWrapper"
// import HasPermissionWrapper from "../../HasPermissionWrapper"

import AutomationAccountSubscriptionCreditExpirationBase from './AutomationAccountSubscriptionCreditExpirationBase'


const ADD_TASK = gql`
  mutation ExpireAccountSubscriptionCredit($input: ExpireAccountSubscriptionCreditInput!) {
    expireAccountSubscriptionCredit(input:$input) {
      ok
    }
  }
`


function AutomationAccountSubscriptionCreditExpirationAdd({ t, history }) {
  const [addTask] = useMutation(ADD_TASK)
  let [isSubmitting, setSubmitting] = useState(false)
  const returnUrl = "/automation/account/subscriptions/credits_expiration"

  return (
    <AutomationAccountSubscriptionCreditExpirationBase returnUrl={returnUrl}>
      <Card>
        <Card.Header>
          <Card.Title>{t('automation.account.subscriptions.credits_expiration.title_add')}</Card.Title>
        </Card.Header>
        <Card.Body>
          <Grid.Row>
            <Grid.Col>
              {t("automation.account.subscriptions.credits_expiration.explanation_new_expiration")}
            </Grid.Col>
          </Grid.Row>
        </Card.Body>
        <Card.Footer>
          <Button 
          color="primary"
            className="pull-right" 
            type="submit" 
            disabled={isSubmitting}
            onClick={() => {
              setSubmitting(true)
              addTask({ variables: {
                input: {}
              }, refetchQueries: [
                {query: GET_TASK_RESULT_QUERY, 
                  variables: {
                    taskName: "costasiella.tasks.account.subscription.credits.tasks.account_subscription_credits_expire"
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
            {t('general.new_task')} <Icon name="chevron-right" />
          </Button>
          <Link to={returnUrl}>
            <Button color="link">
              {t('general.cancel')}
            </Button>
          </Link>
        </Card.Footer>
      </Card>
    </AutomationAccountSubscriptionCreditExpirationBase>
  )
}

export default withTranslation()(withRouter(AutomationAccountSubscriptionCreditExpirationAdd))