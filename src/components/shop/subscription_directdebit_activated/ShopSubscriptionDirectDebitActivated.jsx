// @flow

import React, { useContext } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { useQuery, useMutation } from '@apollo/client'
import { Link } from 'react-router-dom'
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import moment from 'moment'

import {
  Card,
  Grid,
  Icon,
  List
} from "tabler-react"
import { TimeStringToJSDateOBJ } from '../../../tools/date_tools'
import AppSettingsContext from '../../context/AppSettingsContext'

import CSLS from "../../../tools/cs_local_storage"
import ShopSubscriptionDirectDebitActivatedBase from "./ShopSubscriptionDirectDebitActivatedBase"

import { GET_ACCOUNT_SUBSCRIPTION_QUERY } from "./queries"
// import { GET_CLASS_QUERY } from "../queries"

function ShopSubscriptionDirectDebitActivated({ t, match, history }) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const timeFormat = appSettings.timeFormatMoment

  const title = t("shop.home.title")
  const id = match.params.id
  // const scheduleItemId = match.params.class_id
  // const classDate = match.params.date


  // fetchPolicy network-only prevents caching. Need fresh results when coming back after setting bank account.
  const { loading, error, data } = useQuery(GET_ACCOUNT_SUBSCRIPTION_QUERY, {
    variables: { id: id },
    fetchPolicy: "network-only"
  })

  if (loading) return (
    <ShopSubscriptionDirectDebitActivatedBase title={title} >
      {t("general.loading_with_dots")}
    </ShopSubscriptionDirectDebitActivatedBase>
  )
  if (error) return (
    <ShopSubscriptionDirectDebitActivatedBase title={title}>
      {t("shop.subscription.error_loading")}
    </ShopSubscriptionDirectDebitActivatedBase>
  )

  console.log(data)
  const subscription = data.organizationSubscription
  const account = data.user
  console.log(subscription)
  console.log(account)

  return (
    <ShopSubscriptionDirectDebitActivatedBase title={title}>
      <Grid.Row>
        <Grid.Col xs={12} sm={12} md={12} lg={12}>
          <Card title={t("shop.subscription_directdebit_activated.thank_you")}>
            <Card.Body>
              Subscription info here
            </Card.Body>
          </Card>
        </Grid.Col>
      </Grid.Row>
    </ShopSubscriptionDirectDebitActivatedBase>
  )
}

export default withTranslation()(withRouter(ShopSubscriptionDirectDebitActivated))
