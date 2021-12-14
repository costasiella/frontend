// @flow

import React, { useContext } from 'react'
import { useQuery } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import {
  Button,
  Table, 
} from "tabler-react";
import HasPermissionWrapper from "../../HasPermissionWrapper"
// import { confirmAlert } from 'react-confirm-alert'; // Import
import AppSettingsContext from '../../context/AppSettingsContext'

import { get_list_query_variables } from "./tools"
import ContentCard from "../../general/ContentCard"
import FinanceOrdersBase from './FinanceOrdersBase'
import FinanceOrderStatus from "./FinanceOrderStatus"
import FinanceOrderDelete from "./FinanceOrderDelete"

import { GET_ORDERS_QUERY } from "./queries"
import moment from 'moment'



function FinanceOrders({t, match, history}) {
  const appSettings = useContext(AppSettingsContext)
  const dateTimeFormat = appSettings.dateTimeFormatMoment

  const title = t("shop.home.title")
  const { loading, error, data, refetch, fetchMore } = useQuery(GET_ORDERS_QUERY, {
    variables: {get_list_query_variables},
    fetchPolicy: "network-only"
  })

  if (loading) return (
    <FinanceOrdersBase title={title}>
      {t("general.loading_with_dots")}
    </FinanceOrdersBase>
  )

  if (error) return (
    <FinanceOrdersBase title={title}>
      {t("finance.orders.error_loading")}
    </FinanceOrdersBase>
  )

  console.log(data)
  const orders = data.financeOrders
  console.log(orders)

  // Empty list
  if (!orders.edges.length) { return (
    <FinanceOrdersBase refetch={refetch}>
      <ContentCard cardTitle={t('finance.orders.title')}>
        <p>
          {t('finance.orders.empty_list')}
        </p>
      </ContentCard>
    </FinanceOrdersBase>
  )}

  return (
    <FinanceOrdersBase title={title} refetch={refetch}>
      <ContentCard 
        cardTitle={t('finance.orders.title')} 
        pageInfo={orders.pageInfo}
        onLoadMore={() => {
          fetchMore({
            variables: {
              after: orders.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.financeOrders.edges
              const pageInfo = fetchMoreResult.financeOrders.pageInfo

              return newEdges.length
                ? {
                    // Put the new invoices at the end of the list and update `pageInfo`
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
        <Table>
          <Table.Header>
            <Table.Row key={v4()}>
              {/* <Table.ColHeader>{t('general.status')}</Table.ColHeader> */}
              <Table.ColHeader>{t('general.order')}</Table.ColHeader>
              <Table.ColHeader>{t('finance.orders.date')}</Table.ColHeader>
              <Table.ColHeader>{t('finance.orders.relation')}</Table.ColHeader>
              <Table.ColHeader>{t('general.total')}</Table.ColHeader>
              <Table.ColHeader></Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {orders.edges.map(({ node }) => (        
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    # {node.orderNumber} <br />
                    <FinanceOrderStatus status={node.status} />
                  </Table.Col>
                  {/* <Table.Col key={v4()}>
                    
                  </Table.Col> */}
                  <Table.Col key={v4()}>
                    {moment(node.createdAt).format(dateTimeFormat)}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.account && node.account.fullName}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.totalDisplay}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    <FinanceOrderDelete node={node}/>
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
    </FinanceOrdersBase>
  )
}


export default withTranslation()(withRouter(FinanceOrders))