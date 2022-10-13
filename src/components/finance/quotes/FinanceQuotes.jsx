import React from 'react'
import { useQuery } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import {
  Dimmer,
} from "tabler-react";

import CSLS from "../../../tools/cs_local_storage"
import ContentCard from "../../general/ContentCard"
import FinanceQuotesBase from "./FinanceQuotesBase"
import FinanceQuotesList from './FinanceQuotesList'

import { get_list_query_variables } from "./tools"
import { GET_QUOTES_QUERY } from "./queries"


function FinanceQuotes({ t, location, history }) {
  // Set back location for edit quote
  localStorage.setItem(CSLS.FINANCE_QUOTES_EDIT_RETURN, location.pathname)
  // Set back location for account profile
  localStorage.setItem(CSLS.RELATIONS_ACCOUNT_PROFILE_RETURN, location.pathname)
  // Fetch data
  const { loading, error, data, refetch, fetchMore } = useQuery(GET_QUOTES_QUERY, {
    variables: get_list_query_variables(),
    fetchPolicy: "network-only"
  })


  if (loading) return (
    <FinanceQuotesBase refetch={refetch}>
      <ContentCard cardTitle={t('finance.quotes.title')}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </FinanceQuotesBase>
  )
  // Error
  if (error) return (
    <FinanceQuotesBase refetch={refetch}>
      <ContentCard cardTitle={t('finance.quotes.title')}>
        <p>{t('finance.quotes.error_loading')}</p>
      </ContentCard>
    </FinanceQuotesBase>
  )

  const quotes = data.financeQuotes

  // Empty list
  if (!quotes.edges.length) { return (
    <FinanceQuotesBase refetch={refetch}>
      <ContentCard cardTitle={t('finance.quotes.title')}>
        <p>
          {t('finance.quotes.empty_list')}
        </p>
      </ContentCard>
    </FinanceQuotesBase>
  )}

  return (
    <FinanceQuotesBase refetch={refetch}>
      <ContentCard 
        cardTitle={t('finance.quotes.title')}
        hasCardBody={false}
        pageInfo={quotes.pageInfo}
        onLoadMore={() => {
          fetchMore({
            variables: {
              after: quotes.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.financeQuotes.edges
              const pageInfo = fetchMoreResult.financeQuotes.pageInfo

              return newEdges.length
                ? {
                    // Put the new quotes at the end of the list and update `pageInfo`
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
        <FinanceQuotesList 
          quotes={quotes} 
          showColRelation={true}
        />
      </ContentCard>
    </FinanceQuotesBase>
  )
} 

export default withTranslation()(withRouter(FinanceQuotes))
