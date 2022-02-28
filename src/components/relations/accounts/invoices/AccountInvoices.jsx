// @flow

import React, { useContext } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import moment from 'moment'

import {
  Card,
  Icon,
  Button,
  Table,
  Text
} from "tabler-react";
import confirm_delete from "../../../../tools/confirm_delete"

import AppSettingsContext from '../../../context/AppSettingsContext'
import ContentCard from "../../../general/ContentCard"

import RelationsAccountsBack from "../RelationsAccountsBack"
import { GET_ACCOUNT_INVOICES_QUERY } from "./queries"
import CSLS from "../../../../tools/cs_local_storage"
import { DELETE_FINANCE_INVOICE } from "../../../finance/invoices/queries"
import FinanceInvoiceStatus from "../../../ui/FinanceInvoiceStatus"
import AccountInvoicesBase from './AccountInvoicesBase'
import ButtonAdd from "../../../ui/ButtonAdd"


function AccountInvoices({ t, location, match, history }) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat

  const accountId = match.params.account_id
  const cardTitle = t('relations.account.invoices.title')
  const pageHeaderButtonList = <React.Fragment>
    <RelationsAccountsBack />
    <ButtonAdd addUrl={`/relations/accounts/${accountId}/invoices/add`} className="ml-2" />
  </React.Fragment>

  const { loading, error, data, fetchMore } = useQuery(GET_ACCOUNT_INVOICES_QUERY, {
    variables: {accountId: accountId},
    fetchPolicy: "network-only"
  })
  const [deleteFinanceInvoice] = useMutation(DELETE_FINANCE_INVOICE)

  // Loading
  if (loading) return (
    <AccountInvoicesBase pageHeaderButtonList={pageHeaderButtonList}>
      <Card title={cardTitle}>
        <Card.Body>
          <p>{t('general.loading_with_dots')}</p>
        </Card.Body>
      </Card>
    </AccountInvoicesBase>
  )
  // Error
  if (error) {
    console.log(error)
    return (
      <AccountInvoicesBase pageHeaderButtonList={pageHeaderButtonList}>
        <Card title={cardTitle}>
          <Card.Body>
            <p>{t('general.error_sad_smiley')}</p>
          </Card.Body>
        </Card>
      </AccountInvoicesBase>
    )
  }

  // Set back location for edit invoice
  localStorage.setItem(CSLS.FINANCE_INVOICES_EDIT_RETURN, location.pathname)

  let financeInvoices = data.financeInvoices
  const account = data.account
  
  return (
    <AccountInvoicesBase account={account} pageHeaderButtonList={pageHeaderButtonList}>
      <ContentCard 
        cardTitle={cardTitle}
        pageInfo={financeInvoices.pageInfo}
        hasCardBody={false}
        onLoadMore={() => {
          fetchMore({
            variables: {
              after: financeInvoices.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.financeInvoices.edges
              const pageInfo = fetchMoreResult.financeInvoices.pageInfo

              return newEdges.length
                ? {
                    // Put the new financeInvoices at the end of the list and update `pageInfo`
                    // so we have the new `endCursor` and `hasNextPage` values
                    financeInvoices: {
                      __typename: previousResult.financeInvoices.__typename,
                      edges: [ ...previousResult.financeInvoices.edges, ...newEdges ],
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
              <Table.ColHeader>{t('general.name')}</Table.ColHeader>
              <Table.ColHeader>{t('finance.invoices.invoice_number')} & {t('finance.invoices.summary')}</Table.ColHeader>
              <Table.ColHeader>{t('finance.invoices.date')} & {t('finance.invoices.due')}</Table.ColHeader>
              <Table.ColHeader>{t('general.total')}</Table.ColHeader>
              <Table.ColHeader>{t('general.balance')}</Table.ColHeader>
              <Table.ColHeader></Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {financeInvoices.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    <FinanceInvoiceStatus status={node.status} />
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.invoiceNumber} <br />
                    <Text.Small color="gray">{node.summary.trunc(35)}</Text.Small>
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {moment(node.dateSent).format(dateFormat)} <br />
                    <Text.Small color="gray">{moment(node.dateDue).format(dateFormat)}</Text.Small>
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.totalDisplay}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.balanceDisplay}
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    <Button className='btn-sm' 
                            onClick={() => history.push("/finance/invoices/edit/" + node.id)}
                            color="secondary">
                      {t('general.edit')}
                    </Button>
                    <button className="icon btn btn-link btn-sm" 
                      title={t('general.delete')} 
                      href=""
                      onClick={() => {
                        confirm_delete({
                          t: t,
                          msgConfirm: t("finance.invoices.delete_confirm_msg"),
                          msgDescription: <p>{node.invoiceNumber}</p>,
                          msgSuccess: t('finance.invoices.deleted'),
                          deleteFunction: deleteFinanceInvoice,
                          functionVariables: { 
                            variables: {
                              input: {
                                id: node.id
                              }
                            }, 
                            refetchQueries: [
                              {query: GET_ACCOUNT_INVOICES_QUERY, variables: {accountId: accountId}},
                            ]
                          }
                        })
                    }}>
                      <span className="text-red"><Icon prefix="fe" name="trash-2" /></span>
                    </button>
                  </Table.Col>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </AccountInvoicesBase>
  )
}


export default withTranslation()(withRouter(AccountInvoices))
