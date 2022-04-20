import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { useQuery } from '@apollo/client'

import {
  Dimmer,
  Grid,
} from "tabler-react";
import ShopSubscriptionsBase from "./ShopSubscriptionsBase"
import ShopSubscriptionPricingCard from "../subscription/ShopSubscriptionPricingCard"

import { GET_ORGANIZATION_SUBSCRIPTIONS_QUERY } from "./queries"

// Example:
// https://github.com/tabler/tabler-react/blob/master/example/src/interface/PricingCardsPage.react.js


function ShopSubscriptions({ t, match, history }) {
  const { loading, error, data } = useQuery(GET_ORGANIZATION_SUBSCRIPTIONS_QUERY)

  if (loading) return (
    <ShopSubscriptionsBase>
      <Dimmer active={true} loader={true} />
    </ShopSubscriptionsBase>
  )
  if (error) return (
    <ShopSubscriptionsBase>
      {t("shop.subscriptions.error_loading")}
    </ShopSubscriptionsBase>
  )

  const subscriptions = data.organizationSubscriptions

  return (
    <ShopSubscriptionsBase>
        <Grid.Row>
          {subscriptions.edges.map(({ node }) => (
            <Grid.Col xs={12} sm={12} md={3}>
              <ShopSubscriptionPricingCard
                subscription={node}
                btnLink={"/shop/subscription/" + node.id}
              />
            </Grid.Col>
          ))}
        </Grid.Row>

        
    </ShopSubscriptionsBase>
  )
}


export default withTranslation()(withRouter(ShopSubscriptions))
