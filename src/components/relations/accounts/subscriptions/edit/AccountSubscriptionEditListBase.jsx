import React from 'react'
import { useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import { GET_ACCOUNT_SUBSCRIPTION_QUERY } from '../queries'
import AccountSubscriptionEditListBaseBase from "./AccountSubscriptionEditListBaseBase"


function AccountSubscriptionEditListBase({t, history, match, children, pageInfo, onLoadMore, activeTab, returnUrl, pageHeaderButtonList=""}) {
  const accountId = match.params.account_id
  const subscriptionId = match.params.subscription_id
  const { loading, error, data } = useQuery(GET_ACCOUNT_SUBSCRIPTION_QUERY, {
    variables: {
      accountId: accountId,
      id: subscriptionId
    }
  })
  
  if (loading) return (
    <AccountSubscriptionEditListBaseBase activeTab={activeTab} returnUrl={returnUrl} pageHeaderButtonList={pageHeaderButtonList}>
      {t("general.loading_with_dots")}
    </AccountSubscriptionEditListBaseBase>
  )
  if (error) return (
    <AccountSubscriptionEditListBaseBase activeTab={activeTab} returnUrl={returnUrl} pageHeaderButtonList={pageHeaderButtonList}>
      <p>{t('general.error_sad_smiley')}</p>
      <p>{error.message}</p>
    </AccountSubscriptionEditListBaseBase>
  )

  console.log(data)
  const account = data.account
  const subscription = data.accountSubscription

  return (
    <AccountSubscriptionEditListBaseBase 
      activeTab={activeTab} 
      account={account} 
      subscription={subscription}
      pageInfo={pageInfo}
      onLoadMore={onLoadMore}
      returnUrl={returnUrl}
      pageHeaderButtonList={pageHeaderButtonList}
    >
      {children}
    </AccountSubscriptionEditListBaseBase>
  )
}


export default withTranslation()(withRouter(AccountSubscriptionEditListBase))
