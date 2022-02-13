import React, { useContext } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { useQuery } from '@apollo/client'
import { Link } from 'react-router-dom'
import moment from 'moment'
import {
  Card,
  Grid,
  Icon,
  List
} from "tabler-react"

import AppSettingsContext from '../../context/AppSettingsContext'
import ShopSubscriptionDirectDebitActivatedBase from "./ShopSubscriptionDirectDebitActivatedBase"
import { GET_ACCOUNT_SUBSCRIPTION_QUERY } from "./queries"


function ShopSubscriptionDirectDebitActivated({ t, match, history }) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const title = t("shop.home.title")
  const id = match.params.id

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
  const subscription = data.accountSubscription
  const account = data.user
  console.log(subscription)
  console.log(account)

  return (
    <ShopSubscriptionDirectDebitActivatedBase title={title}>
      <Grid.Row>
        <Grid.Col xs={12} sm={12} md={12} lg={12}>
          <Card title={t("shop.subscription_directdebit_activated.thank_you")}>
            <Card.Body>
              {t("shop.subscription_directdebit_activated.message_activated")} <br/>

              <b>{subscription.organizationSubscription.name}</b> {t("shop.subscription_directdebit_activated.starting_on")} {' '}
              <b>{moment(subscription.dateStart).format(dateFormat)}</b>.
              <br /><br />
              <b>{t("shop.subscription_directdebit_activated.what_next_question")}</b>
              <List.Group>
                <Link to="/shop/classes" className="mb-1">
                  <List.GroupItem>
                    {t('shop.subscription_directdebit_activated.next_book_class')} <Icon name="chevron-right"/>
                  </List.GroupItem>
                </Link>
                <Link to="/shop/account" className="mb-1">
                  <List.GroupItem>
                    {t('shop.subscription_directdebit_activated.next_account')} <Icon name="chevron-right"/>
                  </List.GroupItem>
                </Link>
                <Link to="/">
                  <List.GroupItem>
                    {t('shop.subscription_directdebit_activated.next_continue_shopping')} <Icon name="chevron-right"/>
                  </List.GroupItem>
                </Link>
              </List.Group>
            </Card.Body>
          </Card>
        </Grid.Col>
      </Grid.Row>
    </ShopSubscriptionDirectDebitActivatedBase>
  )
}

export default withTranslation()(withRouter(ShopSubscriptionDirectDebitActivated))
