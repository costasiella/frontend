import React from 'react'
import { useQuery } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Card,
} from "tabler-react";

import ContentCard from "../../../general/ContentCard"

import RelationsAccountsBack from "../RelationsAccountsBack"
import { GET_ACCOUNT_QUOTES_QUERY } from "./queries"
import CSLS from "../../../../tools/cs_local_storage"
import FinanceQuotesList from '../../../finance/quotes/FinanceQuotesList'
import AccountQuotesBase from './AccountQuotesBase'
import ButtonAdd from "../../../ui/ButtonAdd"


function AccountQuotes({ t, location, match, history }) {
  const accountId = match.params.account_id
  const cardTitle = t('relations.account.quotes.title')
  const pageHeaderButtonList = <React.Fragment>
    <RelationsAccountsBack />
    <ButtonAdd addUrl={`/relations/accounts/${accountId}/quotes/add`} className="ml-2" />
  </React.Fragment>

  const { loading, error, data, fetchMore } = useQuery(GET_ACCOUNT_QUOTES_QUERY, {
    variables: {accountId: accountId},
    fetchPolicy: "network-only"
  })

  // Loading
  if (loading) return (
    <AccountQuotesBase pageHeaderButtonList={pageHeaderButtonList}>
      <Card title={cardTitle}>
        <Card.Body>
          <p>{t('general.loading_with_dots')}</p>
        </Card.Body>
      </Card>
    </AccountQuotesBase>
  )
  // Error
  if (error) {
    console.log(error)
    return (
      <AccountQuotesBase pageHeaderButtonList={pageHeaderButtonList}>
        <Card title={cardTitle}>
          <Card.Body>
            <p>{t('general.error_sad_smiley')}</p>
          </Card.Body>
        </Card>
      </AccountQuotesBase>
    )
  }

  // Set back location for edit quote
  localStorage.setItem(CSLS.FINANCE_QUOTES_EDIT_RETURN, location.pathname)
  let financeQuotes = data.financeQuotes
  const account = data.account

  // Empty list
  if (!financeQuotes.edges.length) {
    return (
      <AccountQuotesBase account={account} pageHeaderButtonList={pageHeaderButtonList}>
        <Card title={cardTitle}>
          <Card.Body>
            <p>{t('relations.accounts.quotes.empty_list')}</p>
          </Card.Body>
        </Card>
      </AccountQuotesBase>
    )
  }
  
  return (
    <AccountQuotesBase account={account} pageHeaderButtonList={pageHeaderButtonList}>
      <ContentCard 
        cardTitle={cardTitle}
        pageInfo={financeQuotes.pageInfo}
        hasCardBody={false}
        onLoadMore={() => {
          fetchMore({
            variables: {
              after: financeQuotes.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.financeQuotes.edges
              const pageInfo = fetchMoreResult.financeQuotes.pageInfo

              return newEdges.length
                ? {
                    // Put the new financeQuotes at the end of the list and update `pageInfo`
                    // so we have the new `endCursor` and `hasNextPage` values
                    financeQuotes: {
                      __typename: previousResult.financeQuotes.__typename,
                      edges: [ ...previousResult.financeQuotes.edges, ...newEdges ],
                      pageInfo
                    }
                  }
                : previousResult
            }
          })
        }} 
      >
        <FinanceQuotesList quotes={financeQuotes} />
      </ContentCard>
    </AccountQuotesBase>
  )
}

export default withTranslation()(withRouter(AccountQuotes))
