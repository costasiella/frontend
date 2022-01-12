// @flow

import React, {Component } from 'react'
import { gql } from "@apollo/client"
import { useQuery, Mutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_ACCOUNT_SUBSCRIPTION_QUERY } from '../queries'
import AccountSubscriptionForm from '../AccountSubscriptionForm'

import {
  Page,
  Grid,
  Icon,
  Button,
  Card,
  Container,
} from "tabler-react";
import SiteWrapper from "../../../../SiteWrapper"
import HasPermissionWrapper from "../../../../HasPermissionWrapper"
import { dateToLocalISO } from '../../../../../tools/date_tools'
import AccountSubscriptionEditTabs from "./AccountSubscriptionEditTabs"
import AccountSubscriptionEditBaseBase from "./AccountSubscriptionEditBaseBase"

import ProfileMenu from "../../ProfileMenu"


function AccountSubscriptionEditBase({t, history, match, children, activeTab, returnUrl}) {
  const accountId = match.params.account_id
  const subscriptionId = match.params.subscription_id
  const { loading, error, data } = useQuery(GET_ACCOUNT_SUBSCRIPTION_QUERY, {
    variables: {
      accountId: accountId,
      id: subscriptionId
    }
  })
  
  if (loading) return (
    <AccountSubscriptionEditBaseBase activeTab={activeTab} returnUrl={returnUrl}>
      {t("general.loading_with_dots")}
    </AccountSubscriptionEditBaseBase>
  )
  if (error) return (
    <AccountSubscriptionEditBaseBase activeTab={activeTab} returnUrl={returnUrl}>
      <p>{t('general.error_sad_smiley')}</p>
      <p>{error.message}</p>
    </AccountSubscriptionEditBaseBase>
  )

  console.log(data)
  const account = data.account
  const subscription = data.accountSubscription

  return (
    <AccountSubscriptionEditBaseBase 
      activeTab={activeTab} 
      account={account} 
      subscription={subscription}
      returnUrl={returnUrl}  
    >
      {children}
    </AccountSubscriptionEditBaseBase>
  )
}


export default withTranslation()(withRouter(AccountSubscriptionEditBase))
