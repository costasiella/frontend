import React, { useContext } from 'react'
import { useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import { v4 } from 'uuid'

import {
  Button,
  Card,
  Table,
} from "tabler-react";

import AppSettingsContext from '../../../../../context/AppSettingsContext'
import { GET_ACCOUNT_SUBSCRIPTION_BLOCKS_QUERY } from './queries'
import AccountSubscriptionEditListBase from "../AccountSubscriptionEditListBase"
import AccountSubscriptionEditBlockDelete from "./AccountSubscriptionEditBlockDelete"
import moment from 'moment';
import ButtonAdd from '../../../../../ui/ButtonAdd';


function AccountSubscriptionEditBlocks({t, match, history}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  
  const accountId = match.params.account_id
  const subscriptionId = match.params.subscription_id
  const returnUrl = `/relations/accounts/${accountId}/subscriptions`
  const activeTab = "blocks"

  const pageHeaderButtonList = <ButtonAdd 
    addUrl={`/relations/accounts/${accountId}/subscriptions/edit/${subscriptionId}/blocks/add`} 
    className="ml-2"
  />

  const { loading, error, data, fetchMore } = useQuery(GET_ACCOUNT_SUBSCRIPTION_BLOCKS_QUERY, {
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

  const accountSubscriptionBlocks = data.accountSubscriptionBlocks
  const pageInfo = data.accountSubscriptionBlocks.pageInfo

  // Empty list
  if (!accountSubscriptionBlocks.edges.length) { return (
    <AccountSubscriptionEditListBase activeTab={activeTab} returnUrl={returnUrl} pageHeaderButtonList={pageHeaderButtonList}>
      <Card.Body>{t('relations.account.subscriptions.blocks.empty_list')}</Card.Body>
    </AccountSubscriptionEditListBase>
  )}

  const onLoadMore = () => {
    fetchMore({
      variables: {
        after: accountSubscriptionBlocks.pageInfo.endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newEdges = fetchMoreResult.accountSubscriptionBlocks.edges
        const pageInfo = fetchMoreResult.accountSubscriptionBlocks.pageInfo

        return newEdges.length
          ? {
              // Put the new invoices at the end of the list and update `pageInfo`
              // so we have the new `endCursor` and `hasNextPage` values
              accountSubscriptionBlocks: {
                __typename: previousResult.accountSubscriptionBlocks.__typename,
                edges: [ ...previousResult.accountSubscriptionBlocks.edges, ...newEdges ],
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
            <Table.ColHeader>{t('general.date_start')}</Table.ColHeader>
            <Table.ColHeader>{t('general.date_end')}</Table.ColHeader>
            <Table.ColHeader>{t('general.description')}</Table.ColHeader>
            <Table.ColHeader></Table.ColHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
            {accountSubscriptionBlocks.edges.map(({ node }) => (
              <Table.Row key={v4()}>
                <Table.Col>
                  {moment(node.dateStart).format(dateFormat)}
                </Table.Col>
                <Table.Col>
                  {moment(node.dateEnd).format(dateFormat)}
                </Table.Col>
                <Table.Col>
                  <div dangerouslySetInnerHTML={{__html: node.description}} />
                </Table.Col>
                <Table.Col className="text-right">
                  <Link to={`/relations/accounts/${accountId}/subscriptions/edit/${subscriptionId}/blocks/edit/${node.id}`}>
                    <Button className='btn-sm' 
                            color="secondary">
                      {t('general.edit')}
                    </Button>
                  </Link>
                  <AccountSubscriptionEditBlockDelete id={node.id} />
                </Table.Col>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </AccountSubscriptionEditListBase>
  )
}

export default withTranslation()(withRouter(AccountSubscriptionEditBlocks))
