import React from 'react'
import { useQuery } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Card,
} from "tabler-react";

import ContentCard from "../../../general/ContentCard"

import RelationsAccountsBack from "../RelationsAccountsBack"
import { GET_ACCOUNT_INVOICES_QUERY } from "./queries"
import CSLS from "../../../../tools/cs_local_storage"
import FinanceInvoicesList from '../../../finance/invoices/FinanceInvoicesList'
import AccountInvoicesBase from './AccountInvoicesBase'
import ButtonAdd from "../../../ui/ButtonAdd"


function AccountInvoices({ t, location, match, history }) {
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

  // Empty list
  if (!financeInvoices.edges.length) {
    return (
      <AccountInvoicesBase account={account} pageHeaderButtonList={pageHeaderButtonList}>
        <Card title={cardTitle}>
          <Card.Body>
            <p>{t('relations.account.invoices.empty_list')}</p>
          </Card.Body>
        </Card>
      </AccountInvoicesBase>
    )
  }
  
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
        <FinanceInvoicesList invoices={financeInvoices} />
      </ContentCard>
    </AccountInvoicesBase>
  )
}


export default withTranslation()(withRouter(AccountInvoices))
