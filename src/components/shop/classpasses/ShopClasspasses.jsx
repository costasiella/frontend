import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { useQuery } from '@apollo/client'

import {
  Grid,
} from "tabler-react";
import ShopClasspassesBase from "./ShopClasspassesBase"
import ShopClasspassPricingCard from "../classpass/ShopClasspassPricingCard"

import { GET_ORGANIZATION_CLASSPASSES_QUERY } from "./queries"

// Example:
// https://github.com/tabler/tabler-react/blob/master/example/src/interface/PricingCardsPage.react.js


function ShopClasspasses({ t, match, history }) {
  const title = t("shop.home.title")
  const { loading, error, data } = useQuery(GET_ORGANIZATION_CLASSPASSES_QUERY)

  if (loading) return (
    <ShopClasspassesBase title={title} >
      {t("general.loading_with_dots")}
    </ShopClasspassesBase>
  )
  if (error) return (
    <ShopClasspassesBase title={title}>
      {t("shop.classpasses.error_loading")}
    </ShopClasspassesBase>
  )

  const classpasses = data.organizationClasspasses
  
  return (
    <ShopClasspassesBase title={title}>
        <Grid.Row>
          {classpasses.edges.map(({ node }) => (
            <Grid.Col xs={12} sm={12} md={3}>
              <ShopClasspassPricingCard
                classpass={node}
                btnLink={"/shop/classpass/" + node.id}
              />
            </Grid.Col>
          ))}
        </Grid.Row>
    </ShopClasspassesBase>
  )
}

export default withTranslation()(withRouter(ShopClasspasses))
