import React, { useContext } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import moment from 'moment'
import {
  Icon,
  Dimmer,
  Button,
  Table
} from "tabler-react";

import AppSettingsContext from '../../context/AppSettingsContext'
import ContentCard from "../../general/ContentCard"
import InsightInactiveAccountsBase from './InsightInactiveAccountsBase'
import confirm_delete from "../../../tools/confirm_delete"
import { GET_INSIGHT_ACCOUNTS_INACTIVE, DELETE_INSIGHT_ACCOUNTS_INACTIVE } from "./queries"


function InsightInactiveAccounts({t, history, match }) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const dateTimeFormatMoment = appSettings.dateTimeFormatMoment
  const cardTitle = t("insight.inactive_accounts.title")

  const { loading, error, data, fetchMore } = useQuery(GET_INSIGHT_ACCOUNTS_INACTIVE)
  const [deleteInsightAccountsInactive] = useMutation(DELETE_INSIGHT_ACCOUNTS_INACTIVE)

  // Loading
  if (loading) return (
    <InsightInactiveAccountsBase showAdd={true}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </InsightInactiveAccountsBase>
  )
  // Error
  if (error) return (
    <InsightInactiveAccountsBase showAdd={true}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('insight.inactive_accounts.error_loading')}</p>
      </ContentCard>
      </InsightInactiveAccountsBase>
  )

  console.log(data)

  const insightAccountInactives = data.insightAccountInactives
  // Empty list
  if (!insightAccountInactives.edges.length) { return (
    <InsightInactiveAccountsBase showAdd={true}>
      <ContentCard cardTitle={cardTitle} >
        <p>{t("insight.inactive_accounts.empty_list")}</p>
      </ContentCard>
    </InsightInactiveAccountsBase>
  )}

  return (
    <InsightInactiveAccountsBase showAdd={true}>
      <ContentCard cardTitle={cardTitle}
        pageInfo={insightAccountInactives.pageInfo}
        hasCardBody={false}
        onLoadMore={() => {
        fetchMore({
          variables: {
            after: insightAccountInactives.pageInfo.endCursor
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.insightAccountInactives.edges
            const pageInfo = fetchMoreResult.insightAccountInactives.pageInfo

            return newEdges.length
              ? {
                  // Put the new payment_methods at the end of the list and update `pageInfo`
                  // so we have the new `endCursor` and `hasNextPage` values
                  insightAccountInactives: {
                    __typename: previousResult.insightAccountInactives.__typename,
                    edges: [ ...previousResult.insightAccountInactives.edges, ...newEdges ],
                    pageInfo
                  }
                }
              : previousResult
            }
        })
      }} >
        <Table cards>
          <Table.Header>
            <Table.Row key={v4()}>
              <Table.ColHeader>{t('insight.inactive_accounts.created_at')}</Table.ColHeader>
              <Table.ColHeader>{t('insight.inactive_accounts.no_activity_after_date')}</Table.ColHeader>      
              <Table.ColHeader></Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {insightAccountInactives.edges.map(({ node }) => (
              <Table.Row key={v4()}>
                <Table.Col key={v4()}>
                  {moment(node.createdAt).format(dateTimeFormatMoment)}
                </Table.Col>
                <Table.Col key={v4()}>
                  {moment(node.noActivityAfterDate).format(dateFormat)}
                </Table.Col>
                <Table.Col className="text-right">
                  <Link to={`/insight/inactive_accounts/view/${node.id}`}>
                    <Button className='btn-sm' 
                            color="secondary">
                      {t('insight.inactive_accounts.btn_view_inactive_accounts')}
                    </Button>
                  </Link>
                  <button className="icon btn btn-link btn-sm" 
                    title={t('general.delete')} 
                    href=""
                    onClick={() => {
                      confirm_delete({
                        t: t,
                        msgConfirm: t("insight.inactive_accounts.delete_confirm_msg"),
                        msgDescription: <p>{moment(node.created_at).format(dateTimeFormatMoment)} { " - " } 
                          {moment(node.noActivityAfterDate).format(dateFormat)}</p>,
                        msgSuccess: t('insight.inactive_accounts.deleted'),
                        deleteFunction: deleteInsightAccountsInactive,
                        functionVariables: { variables: {
                          input: {
                            id: node.id
                          }
                        }, refetchQueries: [
                          {query: GET_INSIGHT_ACCOUNTS_INACTIVE } 
                        ]}
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
    </InsightInactiveAccountsBase>
  )
}

export default withTranslation()(withRouter(InsightInactiveAccounts))