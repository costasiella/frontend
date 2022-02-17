import React, { useContext } from 'react'
import { useQuery } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import moment from 'moment'
import AppSettingsContext from '../../../../context/AppSettingsContext'
import {
  Table
} from "tabler-react";

import ContentCard from "../../../../general/ContentCard"
import { GET_TASK_RESULT_QUERY } from "../../../queries"
import AutomationAccountSubscriptionInvoicesBase from './AutomationAccountSubscriptionInvoicesBase'
import AutomationTaskResultStatus from "../../../AutomationTaskResultStatus"


function AutomationAccountSubscriptionInvoices({t, history, match}) {
  const appSettings = useContext(AppSettingsContext)
  const dateTimeFormatMoment = appSettings.dateTimeFormatMoment

  const { error, loading, data, fetchMore } = useQuery(GET_TASK_RESULT_QUERY, {
    variables: {
      taskName: "costasiella.tasks.account.subscription.invoices.tasks.account_subscription_invoices_add_for_month"
    }
  })


  // Loading
  if (loading) return (
    <AutomationAccountSubscriptionInvoicesBase showNewTask={true}>
      <p>{t('general.loading_with_dots')}</p>
    </AutomationAccountSubscriptionInvoicesBase>
  )
  // Error
  if (error) {
    console.log(error)
    return (
      <AutomationAccountSubscriptionInvoicesBase showNewTask={true}>
        <p>{t('general.error_sad_smiley')}</p>
      </AutomationAccountSubscriptionInvoicesBase>
    )
  }

  console.log("Automation invoices data:")
  console.log(data)
  const taskResults = data.djangoCeleryResultTaskResults
  // const account = data.account
  // const scheduleItemAttendances = data.scheduleItemAttendances
  

  return (
    <AutomationAccountSubscriptionInvoicesBase showNewTask={true}>
      <ContentCard 
        cardTitle={t('automation.account.subscriptions.invoices.title_card')}
        pageInfo={taskResults.pageInfo}
        onLoadMore={() => {
          fetchMore({
            variables: {
              after: taskResults.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.djangoCeleryResultTaskResults.edges
              const pageInfo = fetchMoreResult.djangoCeleryResultTaskResults.pageInfo

              return newEdges.length
                ? {
                    // Put the new invoices at the end of the list and update `pageInfo`
                    // so we have the new `endCursor` and `hasNextPage` values
                    djangoCeleryResultTaskResults: {
                      __typename: previousResult.djangoCeleryResultTaskResults.__typename,
                      edges: [ ...previousResult.djangoCeleryResultTaskResults.edges, ...newEdges ],
                      pageInfo
                    }
                  }
                : previousResult
              }
            })
          }} 
        >
          { (!taskResults.edges.length) ? 
            // Empty list
            <p>{t('automation.account.subscriptions.invoices.empty_list')}</p>
            :
            // Content
            <Table>
              <Table.Header>
                <Table.Row key={v4()}>
                  <Table.ColHeader>{t('automation.general.status.title')}</Table.ColHeader>
                  <Table.ColHeader>{t('automation.general.time_completed')}</Table.ColHeader>
                  <Table.ColHeader>{t('automation.general.task_kwargs')}</Table.ColHeader>
                  <Table.ColHeader>{t('automation.general.task_result')}</Table.ColHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {taskResults.edges.map(({ node }) => (
                  <Table.Row key={v4()}>
                    <Table.Col>
                      <AutomationTaskResultStatus status={node.status} />
                    </Table.Col>
                    <Table.Col>
                      {moment(node.dateDone).format(dateTimeFormatMoment)}
                    </Table.Col>
                    <Table.Col>
                      {node.taskKwargs}
                    </Table.Col>
                    <Table.Col>
                      {node.result}
                    </Table.Col>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          }
        </ContentCard>
    </AutomationAccountSubscriptionInvoicesBase>
  )
}

export default withTranslation()(withRouter(AutomationAccountSubscriptionInvoices))