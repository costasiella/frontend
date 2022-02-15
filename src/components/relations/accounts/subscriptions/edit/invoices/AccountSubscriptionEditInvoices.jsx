import React from 'react'
import { useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { v4 } from 'uuid'

import {
  Button,
  Card,
  Table,
  Text
} from "tabler-react";
// import HasPermissionWrapper from "../../../../HasPermissionWrapper"

import FinanceInvoicesStatus from "../../../../../ui/FinanceInvoiceStatus"
import { GET_FINANCE_INVOICE_ITEM_QUERY } from './queries'
import CSLS from "../../../../../../tools/cs_local_storage"
import AccountSubscriptionEditInvoiceDelete from "./AccountSubscriptionEditInvoiceDelete"
import AccountSubscriptionEditListBase from "../AccountSubscriptionEditListBase"
import ButtonAdd from '../../../../../ui/ButtonAdd';
import moment from 'moment';


function AccountSubscriptionEditInvoices({t, location, match, history}) {  
  const accountId = match.params.account_id
  const subscriptionId = match.params.subscription_id
  const returnUrl = `/relations/accounts/${accountId}/subscriptions`
  const activeTab = "invoices"

  const pageHeaderButtonList = <ButtonAdd
    addUrl={`/relations/accounts/${accountId}/subscriptions/edit/${subscriptionId}/invoices/add`} 
    className="ml-2"  
  />

  const { loading, error, data, fetchMore } = useQuery(GET_FINANCE_INVOICE_ITEM_QUERY, {
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
  // Set back location for edit invoice
  localStorage.setItem(CSLS.FINANCE_INVOICES_EDIT_RETURN, location.pathname)

  const financeInvoiceItems = data.financeInvoiceItems
  const pageInfo = data.financeInvoiceItems.pageInfo


  // Empty list
  if (!financeInvoiceItems.edges.length) { return (
    <AccountSubscriptionEditListBase activeTab={activeTab} returnUrl={returnUrl} pageHeaderButtonList={pageHeaderButtonList} >

      <Card.Body>{t('relations.account.subscriptions.invoices.empty_list')}</Card.Body>
    </AccountSubscriptionEditListBase>
  )}
  // const inputData = data
  // const account = data.account
  // const initialdata = data.accountSubscription

  // let initialPaymentMethod = ""
  // if (initialdata.financePaymentMethod) {
  //   initialPaymentMethod = initialdata.financePaymentMethod.id
  // }

  const onLoadMore = () => {
    fetchMore({
      variables: {
        after: financeInvoiceItems.pageInfo.endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newEdges = fetchMoreResult.financeInvoiceItems.edges
        const pageInfo = fetchMoreResult.financeInvoiceItems.pageInfo

        return newEdges.length
          ? {
              // Put the new invoices at the end of the list and update `pageInfo`
              // so we have the new `endCursor` and `hasNextPage` values
              financeInvoiceItems: {
                __typename: previousResult.financeInvoiceItems.__typename,
                edges: [ ...previousResult.financeInvoiceItems.edges, ...newEdges ],
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
            <Table.ColHeader>{t('general.status')}</Table.ColHeader>
            <Table.ColHeader>{t('finance.invoices.invoice_number')} & {t('finance.invoices.summary')}</Table.ColHeader>
            <Table.ColHeader>{t('finance.invoices.date')} & {t('finance.invoices.due')}</Table.ColHeader>
            {/* <Table.ColHeader>{t('finance.invoices.due')}</Table.ColHeader> */}
            <Table.ColHeader>{t('general.total')}</Table.ColHeader>
            <Table.ColHeader>{t('general.balance')}</Table.ColHeader>
            <Table.ColHeader></Table.ColHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
            {financeInvoiceItems.edges.map(({ node }) => (
              <Table.Row key={v4()}>
                <Table.Col key={v4()}>
                  <FinanceInvoicesStatus status={node.financeInvoice.status} />
                </Table.Col>
                <Table.Col key={v4()}>
                  {node.financeInvoice.invoiceNumber} <br />
                  <Text.Small color="gray">{node.financeInvoice.summary.trunc(30)}</Text.Small>
                </Table.Col>

                <Table.Col key={v4()}>
                  {moment(node.financeInvoice.dateSent).format('LL')} <br />
                  {moment(node.financeInvoice.dateDue).format('LL')}
                </Table.Col>
                <Table.Col key={v4()}>
                  {node.financeInvoice.totalDisplay}
                </Table.Col>
                <Table.Col key={v4()}>
                  {node.financeInvoice.balanceDisplay}
                </Table.Col>
                <Table.Col className="text-right" key={v4()}>
                  <Button className='btn-sm' 
                          onClick={() => history.push("/finance/invoices/edit/" + node.financeInvoice.id)}
                          color="secondary">
                    {t('general.edit')}
                  </Button>
                  <AccountSubscriptionEditInvoiceDelete id={node.financeInvoice.id} />
                </Table.Col>
                {/* <Table.Col>
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
                </Table.Col>
                <Table.Col className="text-right">
                  <AccountSubscriptionEditCreditDelete id={node.id} />
                </Table.Col> */}
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </AccountSubscriptionEditListBase>
  )
}

export default withTranslation()(withRouter(AccountSubscriptionEditInvoices))
