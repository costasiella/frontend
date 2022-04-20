import React from 'react'
import { useQuery } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import {
  Card,
  Dimmer,
  Grid
} from "tabler-react";

import { QUERY_SYSTEM_MAILCHIMP_LISTS } from "./queries"
import GET_USER_PROFILE from "../../../../queries/system/get_user_profile"
import ShopAccountMailingListsBase from "./ShopAccountMailingListsBase"
import ShopAccountMailingListCard from "./ShopAccountMailingListCard"


function ShopAccountMailingLists({t, match, history}) {
  const { loading: loadingUser, error: errorUser, data: dataUser } = useQuery(GET_USER_PROFILE)
  const { loading, error, data } = useQuery(QUERY_SYSTEM_MAILCHIMP_LISTS, {
    skip: loadingUser || errorUser || !dataUser,
    variables: {
      account: dataUser && dataUser.user ? dataUser.user.accountId : null
    }
  })

  if (loading || loadingUser || !data) return (
    <ShopAccountMailingListsBase>
      <Dimmer active={true} loader={true} />
    </ShopAccountMailingListsBase>
  )
  if (error || errorUser) return (
    <ShopAccountMailingListsBase>
      {t("shop.account.mailing_lists.error_loading_data")}
    </ShopAccountMailingListsBase>
  )

  const user = data.user
  const mailingLists = data.systemMailchimpLists

  // Empty list
  if (!mailingLists.edges.length) {
    return (
      <ShopAccountMailingListsBase accountName={user.fullName}>
        <Grid.Row>
          <Grid.Col md={12}>
            <Card cardTitle={t('shop.account.mailing_lists.title')} >
              <Card.Body>
                {t('shop.account.mailing_lists.empty_list')}
              </Card.Body>
            </Card>
          </Grid.Col>
        </Grid.Row>
      </ShopAccountMailingListsBase>
    )  
  }

  // Populated list
  return (
    <ShopAccountMailingListsBase accountName={user.fullName}>
      <Grid.Row>
        <Grid.Col md={12}>
          <h4>{t('shop.account.mailing_lists.title')}</h4>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        {mailingLists.edges.map(({ node }) => (
          <Grid.Col xs={12} sm={12} md={4}>
            <ShopAccountMailingListCard
              mailingList={node}
              // btnLink={"/shop/classpass/" + node.id}
            />
          </Grid.Col>
        ))}
      </Grid.Row>
    </ShopAccountMailingListsBase>
  )
}


export default withTranslation()(withRouter(ShopAccountMailingLists))