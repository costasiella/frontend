import React, { useContext } from 'react'
import { useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import { v4 } from 'uuid'
import moment from 'moment'

import {
  Button,
  Card,
  Table,
} from "tabler-react";
// import HasPermissionWrapper from "../../../../HasPermissionWrapper"

import ButtonAdd from '../../../../../ui/ButtonAdd';
import SubscriptionCreditsMutationType from "../../../../../ui/SubscriptionCreditsMutationType"
import AppSettingsContext from '../../../../../context/AppSettingsContext'
import { GET_ACCOUNT_SUBSCRIPTION_CREDITS_QUERY } from './queries'
import AccountSubscriptionEditListBase from "../AccountSubscriptionEditListBase"
import AccountSubscriptionEditCreditDelete from "./AccountSubscriptionEditCreditDelete"



function AccountSubscriptionEditCredits({t, match, history}) {
  const appSettings = useContext(AppSettingsContext)
  const dateTimeFormatMoment = appSettings.dateTimeFormatMoment
  
  const accountId = match.params.account_id
  const subscriptionId = match.params.subscription_id
  const returnUrl = `/relations/accounts/${accountId}/subscriptions`
  const activeTab = "credits"

  const pageHeaderButtonList = <ButtonAdd
    addUrl={`/relations/accounts/${accountId}/subscriptions/edit/${subscriptionId}/credits/add`} 
    className="ml-2"
  />

  const { loading, error, data, fetchMore } = useQuery(GET_ACCOUNT_SUBSCRIPTION_CREDITS_QUERY, {
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

  console.log('query data')
  console.log(data)

  const accountSubscriptionCredits = data.accountSubscriptionCredits
  const pageInfo = data.accountSubscriptionCredits.pageInfo

  // Empty list
  if (!accountSubscriptionCredits.edges.length) { return (
    <AccountSubscriptionEditListBase activeTab={activeTab} returnUrl={returnUrl} pageHeaderButtonList={pageHeaderButtonList}>
      <Card.Body>{t('relations.account.subscriptions.credits.empty_list')}</Card.Body>
    </AccountSubscriptionEditListBase>
  )}

  const onLoadMore = () => {
    fetchMore({
      variables: {
        after: accountSubscriptionCredits.pageInfo.endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newEdges = fetchMoreResult.accountSubscriptionCredits.edges
        const pageInfo = fetchMoreResult.accountSubscriptionCredits.pageInfo

        return newEdges.length
          ? {
              // Put the new invoices at the end of the list and update `pageInfo`
              // so we have the new `endCursor` and `hasNextPage` values
              accountSubscriptionCredits: {
                __typename: previousResult.accountSubscriptionCredits.__typename,
                edges: [ ...previousResult.accountSubscriptionCredits.edges, ...newEdges ],
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
            <Table.ColHeader>{t('general.time')}</Table.ColHeader>
            <Table.ColHeader>{t('general.description')}</Table.ColHeader>
            <Table.ColHeader>{t('general.credits')}</Table.ColHeader>
            <Table.ColHeader>{t('general.mutation')}</Table.ColHeader>
            <Table.ColHeader></Table.ColHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
            {accountSubscriptionCredits.edges.map(({ node }) => (
              <Table.Row key={v4()}>
                <Table.Col>
                  {moment(node.createdAt).format(dateTimeFormatMoment)}
                </Table.Col>
                <Table.Col>
                  <div dangerouslySetInnerHTML={{__html: node.description}} />
                </Table.Col>
                <Table.Col>
                  {node.mutationAmount}
                </Table.Col>
                <Table.Col>
                  <SubscriptionCreditsMutationType mutationType={node.mutationType} />
                </Table.Col>
                <Table.Col className="text-right">
                  <Link to={`/relations/accounts/${accountId}/subscriptions/edit/${subscriptionId}/credits/edit/${node.id}`}>
                    <Button className='btn-sm' 
                            color="secondary">
                      {t('general.edit')}
                    </Button>
                  </Link>
                  <AccountSubscriptionEditCreditDelete id={node.id} />
                </Table.Col>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </AccountSubscriptionEditListBase>
  )
}

export default withTranslation()(withRouter(AccountSubscriptionEditCredits))
