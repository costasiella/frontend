import React from 'react'
import { useQuery } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import {
  Dimmer,
} from "tabler-react";

import CSLS from "../../../tools/cs_local_storage"
import ContentCard from "../../general/ContentCard"
import FinanceInvoicesBase from "./FinanceInvoicesBase"
import FinanceInvoicesList from './FinanceInvoicesList'

import { get_list_query_variables } from "./tools"
import { GET_INVOICES_QUERY } from "./queries"


function FinanceInvoices({ t, location, history }) {
  // Set back location for edit invoice
  localStorage.setItem(CSLS.FINANCE_INVOICES_EDIT_RETURN, location.pathname)
  // Fetch data
  const { loading, error, data, refetch, fetchMore } = useQuery(GET_INVOICES_QUERY, {
    variables: get_list_query_variables(),
    fetchPolicy: "network-only"
  })

  if (loading) return (
    <FinanceInvoicesBase refetch={refetch}>
      <ContentCard cardTitle={t('finance.invoices.title')}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </FinanceInvoicesBase>
  )
  // Error
  if (error) return (
    <FinanceInvoicesBase refetch={refetch}>
      <ContentCard cardTitle={t('finance.invoices.title')}>
        <p>{t('finance.invoices.error_loading')}</p>
      </ContentCard>
    </FinanceInvoicesBase>
  )

  const invoices = data.financeInvoices

  // Empty list
  if (!invoices.edges.length) { return (
    <FinanceInvoicesBase refetch={refetch}>
      <ContentCard cardTitle={t('finance.invoices.title')}>
        <p>
          {t('finance.invoices.empty_list')}
        </p>
      </ContentCard>
    </FinanceInvoicesBase>
  )}

  return (
    <FinanceInvoicesBase refetch={refetch}>
      <ContentCard 
        cardTitle={t('finance.invoices.title')}
        hasCardBody={false}
        pageInfo={invoices.pageInfo}
        onLoadMore={() => {
          fetchMore({
            variables: {
              after: invoices.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.financeInvoices.edges
              const pageInfo = fetchMoreResult.financeInvoices.pageInfo

              return newEdges.length
                ? {
                    // Put the new invoices at the end of the list and update `pageInfo`
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
        <FinanceInvoicesList 
          invoices={invoices} 
          showColRelation={true}
        />
      </ContentCard>
    </FinanceInvoicesBase>
  )
} 

export default withTranslation()(withRouter(FinanceInvoices))