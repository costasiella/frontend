
import React from 'react'
import { useQuery } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import {
  Dimmer,
} from "tabler-react";

import ContentCard from "../../general/ContentCard"
import FinanceExpensesBase from "./FinanceExpensesBase"
import FinanceExpensesList from './FinanceExpensesList'
import FinanceExpensesFilter from './FinanceExpensesFilter';

import { get_list_query_variables } from "./tools"
import { GET_EXPENSES_QUERY } from "./queries"


function FinanceExpenses({ t, location, history }) {
  // Fetch data
  const { loading, error, data, refetch, fetchMore } = useQuery(GET_EXPENSES_QUERY, {
    variables: get_list_query_variables(),
    fetchPolicy: "network-only"
  })

  function test(vars) {
    refetch(get_list_query_variables())
    console.log(vars)
  }


  if (loading) return (
    <FinanceExpensesBase refetch={refetch}>
      <ContentCard cardTitle={t('finance.expenses.title')}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </FinanceExpensesBase>
  )
  // Error
  if (error) return (
    <FinanceExpensesBase refetch={refetch}>
      <ContentCard cardTitle={t('finance.expenses.title')}>
        <p>{t('finance.expenses.error_loading')}</p>
      </ContentCard>
    </FinanceExpensesBase>
  )

  const expenses = data.financeExpenses

  // Empty list
  if (!expenses.edges.length) { return (
    <FinanceExpensesBase refetch={refetch} showListButtons={true}>
      <FinanceExpensesFilter data={data} refetch={refetch} />
      <ContentCard cardTitle={t('finance.expenses.title')}>
        <p>
          {t('finance.expenses.empty_list')}
        </p>
      </ContentCard>
    </FinanceExpensesBase>
  )}

  return (
    <FinanceExpensesBase refetch={refetch} showListButtons={true}>
      <FinanceExpensesFilter data={data} refetch={test} />
      <ContentCard 
        cardTitle={t('finance.expenses.title')}
        hasCardBody={false}
        pageInfo={expenses.pageInfo}
        onLoadMore={() => {
          fetchMore({
            variables: {
              after: expenses.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.financeExpenses.edges
              const pageInfo = fetchMoreResult.financeExpenses.pageInfo

              return newEdges.length
                ? {
                    // Put the new expenses at the end of the list and update `pageInfo`
                    // so we have the new `endCursor` and `hasNextPage` values
                    financeExpenses: {
                      __typename: previousResult.financeExpenses.__typename,
                      edges: [ ...previousResult.financeExpenses.edges, ...newEdges ],
                      pageInfo
                    }
                  }
                : previousResult
            }
          })
        }} 
      >
        <FinanceExpensesList 
          expenses={expenses} 
          showColRelation={true}
        />
      </ContentCard>
    </FinanceExpensesBase>
  )
} 

export default withTranslation()(withRouter(FinanceExpenses))