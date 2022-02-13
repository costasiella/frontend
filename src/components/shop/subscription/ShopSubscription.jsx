import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { useQuery } from '@apollo/client'

import {
  Card,
  Grid,
} from "tabler-react"

import CSLS from "../../../tools/cs_local_storage"
import CheckoutCardMollie from './CheckoutCardMollie'
import CheckoutCardBankAccountRequired from './CheckoutCardBankAccountRequired'
import CheckoutCardDirectDebit from './CheckoutCardDirectDebit'
import ShopSubscriptionBase from "./ShopSubscriptionBase"
import ShopSubscriptionPricingCard from "./ShopSubscriptionPricingCard"

import { GET_SUBSCRIPTION_QUERY } from "./queries"

function ShopSubscription({ t, match, history }) {
  const title = t("shop.home.title")
  const id = match.params.id

  // fetchPolicy network-only prevents caching. Need fresh results when coming back after setting bank account.
  const { loading, error, data } = useQuery(GET_SUBSCRIPTION_QUERY, {
    variables: { id: id },
    fetchPolicy: "network-only"
  })

  if (loading) return (
    <ShopSubscriptionBase title={title} >
      {t("general.loading_with_dots")}
    </ShopSubscriptionBase>
  )
  if (error) return (
    <ShopSubscriptionBase title={title}>
      {t("shop.subscription.error_loading")}
    </ShopSubscriptionBase>
  )

  console.log(data)
  const subscription = data.organizationSubscription
  const account = data.user
  console.log(subscription)
  console.log(account)

  let CheckoutCard

  // Check for shop subscription payment method
  if (subscription.shopPaymentMethod === "DIRECTDEBIT") {
    // Check for bank account details, if not set, 
    if (!account.hasBankAccountInfo) {
      // Create local storage back url for account bank account component    
      localStorage.setItem(CSLS.SHOP_ACCOUNT_BANK_ACCOUNT_NEXT, `/shop/subscription/${id}`)
      // Show bank account requird 
      CheckoutCard = <CheckoutCardBankAccountRequired />
    } else {
      // Allow customer to create a subscription
      CheckoutCard = <CheckoutCardDirectDebit accountId={account.accountId} organizationSubscription={subscription} />
    }
  } else {
    CheckoutCard = <CheckoutCardMollie organizationSubscriptionId={id} />
  }


  return (
    <ShopSubscriptionBase title={title}>
      <Grid.Row>
        <Grid.Col xs={12} sm={12} md={4}>
          <ShopSubscriptionPricingCard subscription={subscription} active={true} displayCheckoutInfo={true} />
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4}>
          <Card title={t("shop.subscription.additional_information")}>
            <Card.Body>
              <div dangerouslySetInnerHTML={{__html:subscription.description}}></div>
            </Card.Body>
          </Card>
        </Grid.Col>
        <Grid.Col xs={12} sm={12} md={4}>
          {CheckoutCard}
        </Grid.Col>
      </Grid.Row>
    </ShopSubscriptionBase>
  )
}


export default withTranslation()(withRouter(ShopSubscription))
