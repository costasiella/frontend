import React from 'react'
import { useQuery } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"
import { v4 } from "uuid"
import {
  Card,
  Dimmer,
  Table
} from "tabler-react";

import { GET_ACCOUNT_SUBSCRIPTIONS_WO_KEYNUMBER_QUERY } from './queries'
import ContentCard from '../../general/ContentCard'
import InsightKeyNumbersWoSubscriptionBase from './InsightKeyNumbersWoSubscriptionBase'


function InsightKeyNumbersWoSubscription ({ t, history }) {
  const cardTitle = t("insight.keynumbers_wo_subscription.title")

  const { loading, error, data, fetchMore } = useQuery(
    GET_ACCOUNT_SUBSCRIPTIONS_WO_KEYNUMBER_QUERY, {
      fetchPolicy: "network-only"
    }
  )

  if (loading) {
    return (
      <InsightKeyNumbersWoSubscriptionBase>
        <Dimmer active={true} loader={true} />
      </InsightKeyNumbersWoSubscriptionBase>
    )
  }

  if (error) {
    return (
      <InsightKeyNumbersWoSubscriptionBase>
        {t("general.error_sad_smiley")}
      </InsightKeyNumbersWoSubscriptionBase>
    )
  }

  console.log(data)
  let accountSubscriptions = data.accountSubscriptions

  // Empty list
  if (!accountSubscriptions.edges.length) {
    return (
      <InsightKeyNumbersWoSubscriptionBase>
        <Card title={cardTitle}>
          <Card.Body>
            <p>{t("insight.keynumbers_wo_subscription.empty_list")}</p>
          </Card.Body>
        </Card>
      </InsightKeyNumbersWoSubscriptionBase>
    )
  }


  return (
    <InsightKeyNumbersWoSubscriptionBase>
      <ContentCard cardTitle={cardTitle}
          // headerContent={headerOptions}
          hasCardBody={false}
          pageInfo={accountSubscriptions.pageInfo}
          onLoadMore={() => {
          fetchMore({
            variables: {
              after: accountSubscriptions.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.accountSubscriptions.edges
              const pageInfo = fetchMoreResult.accountSubscriptions.pageInfo

              return newEdges.length
                ? {
                    // Put the new glaccounts at the end of the list and update `pageInfo`
                    // so we have the new `endCursor` and `hasNextPage` values
                    accountSubscriptions: {
                      __typename: previousResult.accountSubscriptions.__typename,
                      edges: [ ...previousResult.accountSubscriptions.edges, ...newEdges ],
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
              <Table.ColHeader>{t('general.account')}</Table.ColHeader>
              <Table.ColHeader>{t('general.subscription')}</Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {accountSubscriptions.edges.map(({ node }) => (
                <Table.Row>
                  <Table.Col>
                    <Link to={`/relations/accounts/${node.account.id}/profile/`}>
                      {node.account.fullName}
                    </Link>
                  </Table.Col>
                  <Table.Col>
                    {node.organizationSubscription.name} <br />
                    <small className='text-muted'>
                      {node.dateStart}
                    </small>
                  </Table.Col>
                  {/* <Table.Col>
                    <List unstyled>
                      {node.account.classpasses.edges && node.account.classpasses.edges.map(({ node }) => (
                        <List.Item>
                          <Icon name="credit-card" /> { " " }
                          {node.organizationClasspass.name} <br />
                          <small className='text-muted'>
                            {node.dateStart}
                          </small>
                        </List.Item>
                      ))}
                    </List>
                    <List unstyled>
                      {node.account.subscriptions.edges && node.account.subscriptions.edges.map(({ node }) => (
                        <List.Item>
                          <Icon name="edit" /> { " " }
                          {node.organizationSubscription.name} <br />
                          <small className='text-muted'>
                            {node.dateStart}
                          </small>
                        </List.Item>
                      ))}
                    </List>
                  </Table.Col> */}
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </InsightKeyNumbersWoSubscriptionBase>
  )
}

export default withTranslation()(withRouter(InsightKeyNumbersWoSubscription))