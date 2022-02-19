import React, { useContext } from 'react'
import { useQuery } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import moment from 'moment'

import {
  Button,
  Card,
  Table
} from "tabler-react";

import AppSettingsContext from '../../../context/AppSettingsContext'
import FinanceOrderStatus from "../../../finance/orders/FinanceOrderStatus"

import ContentCard from "../../../general/ContentCard"
import AccountOrdersBase from "./AccountOrdersBase"
import AccountOrderDelete from "./AccountOrderDelete"

import { GET_ACCOUNT_ORDERS_QUERY } from "./queries"


function AccountOrders({ t, match, history }) {
  const appSettings = useContext(AppSettingsContext)
  const dateTimeFormat = appSettings.dateTimeFormatMoment
  const cardTitle = t('relations.account.orders.title')
  const account_id = match.params.account_id
  const { loading, error, data, fetchMore } = useQuery(GET_ACCOUNT_ORDERS_QUERY, {
    variables: {'account': account_id},
  })

  // Loading
  if (loading) return (
    <AccountOrdersBase>
      <Card title={cardTitle}>
        <Card.Body>
          <p>{t('general.loading_with_dots')}</p>
        </Card.Body>
      </Card>
    </AccountOrdersBase>
  )
  // Error
  if (error) {
    console.log(error)
    return (
      <AccountOrdersBase>
        <Card title={cardTitle}>
          <Card.Body>
            <p>{t('general.error_sad_smiley')}</p>
          </Card.Body>
        </Card>
      </AccountOrdersBase>
    )
  }

  console.log("AccountClasses data:")
  console.log(data)
  const account = data.account
  const financeOrders = data.financeOrders
  
  // Empty list
  if (!financeOrders.edges.length) {
    return (
      <AccountOrdersBase account={account}>
        <Card title={cardTitle}>
          <Card.Body>
            <p>{t('relations.account.orders.empty_list')}</p>
          </Card.Body>
        </Card>
      </AccountOrdersBase>
    )
  }

  // Return populated list
  return (
    <AccountOrdersBase account={account}>
      <ContentCard 
        cardTitle={t('relations.account.orders.title')}
        pageInfo={financeOrders.pageInfo}
        hasCardBody={false}
        onLoadMore={() => {
          fetchMore({
            variables: {
              after: financeOrders.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.financeOrders.edges
              const pageInfo = fetchMoreResult.financeOrders.pageInfo

              return newEdges.length
                ? {
                    // Put the new financeOrders at the end of the list and update `pageInfo`
                    // so we have the new `endCursor` and `hasNextPage` values
                    financeOrders: {
                      __typename: previousResult.financeOrders.__typename,
                      edges: [ ...previousResult.financeOrders.edges, ...newEdges ],
                      pageInfo
                    }
                  }
                : previousResult
            }
          })
        }} 
      >
        <Table cards>
          <Table.Header>
            <Table.Row key={v4()}>
            <Table.ColHeader>{t('general.status')}</Table.ColHeader>
              <Table.ColHeader>{t('finance.orders.order_number')}</Table.ColHeader>
              <Table.ColHeader>{t('finance.orders.date')}</Table.ColHeader>
              <Table.ColHeader>{t('general.total')}</Table.ColHeader>
              <Table.ColHeader></Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {financeOrders.edges.map(({ node }) => (        
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    <FinanceOrderStatus status={node.status} />
                  </Table.Col>
                  <Table.Col key={v4()}>
                    # {node.orderNumber}
                  </Table.Col>
                  <Table.Col>
                    {moment(node.createdAt).format(dateTimeFormat)}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.totalDisplay}
                  </Table.Col>
                  <Table.Col key={v4()}>
                  <AccountOrderDelete node={node} account={account} />
                    <Link to={"/finance/orders/edit/" + node.id}>
                      <Button className='btn-sm float-right' 
                              color="secondary">
                        {t('general.edit')}
                      </Button>
                    </Link>
                  </Table.Col>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </AccountOrdersBase>
  )
}
      
        
export default withTranslation()(withRouter(AccountOrders))