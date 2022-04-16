import React from 'react'
import { useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import { v4 } from 'uuid'
import DOMPurify from 'dompurify'
import {
  Button,
  Card,
  Table,
} from "tabler-react";

import ButtonAdd from '../../../../../ui/ButtonAdd'
import { GET_ACCOUNT_SUBSCRIPTION_ALT_PRICES_QUERY } from './queries'
import AccountSubscriptionEditListBase from "../AccountSubscriptionEditListBase"
import AccountSubscriptionEditAltPriceDelete from "./AccountSubscriptionEditAltPriceDelete"


function AccountSubscriptionEditAltPrices({t, match, history}) {
  const accountId = match.params.account_id
  const subscriptionId = match.params.subscription_id
  const returnUrl = `/relations/accounts/${accountId}/subscriptions`
  const activeTab = "alt_prices"

  const pageHeaderButtonList = <ButtonAdd
    addUrl={`/relations/accounts/${accountId}/subscriptions/edit/${subscriptionId}/alt_prices/add`} 
    className="ml-2"
   />

  const { loading, error, data, fetchMore } = useQuery(GET_ACCOUNT_SUBSCRIPTION_ALT_PRICES_QUERY, {
    variables: {
      accountSubscription: subscriptionId
    }
  })
  
  if (loading) return (
    <AccountSubscriptionEditListBase activeTab={activeTab} returnUrl={returnUrl} pageHeaderButtonList={pageHeaderButtonList}>
      {t("general.loading_with_dots")}
    </AccountSubscriptionEditListBase>
  )
  if (error) return (
    <AccountSubscriptionEditListBase activeTab={activeTab} returnUrl={returnUrl} pageHeaderButtonList={pageHeaderButtonList}>
      <p>{t('general.error_sad_smiley')}</p>
      <p>{error.message}</p>
    </AccountSubscriptionEditListBase>
  )

  const accountSubscriptionAltPrices = data.accountSubscriptionAltPrices
  const pageInfo = data.accountSubscriptionAltPrices.pageInfo

    // Empty list
    if (!accountSubscriptionAltPrices.edges.length) { return (
      <AccountSubscriptionEditListBase activeTab={activeTab} returnUrl={returnUrl} pageHeaderButtonList={pageHeaderButtonList}>
        <Card.Body>{t('relations.account.subscriptions.alt_prices.empty_list')}</Card.Body>
      </AccountSubscriptionEditListBase>
    )}

  const onLoadMore = () => {
    fetchMore({
      variables: {
        after: accountSubscriptionAltPrices.pageInfo.endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newEdges = fetchMoreResult.accountSubscriptionAltPrices.edges
        const pageInfo = fetchMoreResult.accountSubscriptionAltPrices.pageInfo

        return newEdges.length
          ? {
              // Put the new invoices at the end of the list and update `pageInfo`
              // so we have the new `endCursor` and `hasNextPage` values
              accountSubscriptionAltPrices: {
                __typename: previousResult.accountSubscriptionAltPrices.__typename,
                edges: [ ...previousResult.accountSubscriptionAltPrices.edges, ...newEdges ],
                pageInfo
              }
            }
          : previousResult
      }
    })
  }

  return (
    <AccountSubscriptionEditListBase 
      activeTab={activeTab} 
      pageInfo={pageInfo} 
      onLoadMore={onLoadMore}
      returnUrl={returnUrl} 
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <br />
      <Table cards>
        <Table.Header>
          <Table.Row key={v4()}>
            <Table.ColHeader>{t('general.subscription_year')}</Table.ColHeader>
            <Table.ColHeader>{t('general.subscription_month')}</Table.ColHeader>
            <Table.ColHeader>{t('general.amount')}</Table.ColHeader>
            <Table.ColHeader>{t('general.description')}</Table.ColHeader>
            <Table.ColHeader></Table.ColHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
            {accountSubscriptionAltPrices.edges.map(({ node }) => (
              <Table.Row key={v4()}>
                <Table.Col>
                  {node.subscriptionYear}
                </Table.Col>
                <Table.Col>
                  {node.subscriptionMonth}
                </Table.Col>
                <Table.Col>
                  {node.amountDisplay}
                </Table.Col>
                <Table.Col>
                <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(node.description) }} />
                </Table.Col>
                <Table.Col className="text-right">
                  <Link to={`/relations/accounts/${accountId}/subscriptions/edit/${subscriptionId}/alt_prices/edit/${node.id}`}>
                    <Button className='btn-sm' 
                            color="secondary">
                      {t('general.edit')}
                    </Button>
                  </Link>
                  <AccountSubscriptionEditAltPriceDelete id={node.id} />
                </Table.Col>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </AccountSubscriptionEditListBase>
  )
}

export default withTranslation()(withRouter(AccountSubscriptionEditAltPrices))
