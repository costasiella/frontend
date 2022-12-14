import React, { useContext } from 'react'
import { useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import { v4 } from 'uuid'
import moment from 'moment'
import DOMPurify from 'dompurify'
import {
  Badge,
  Button,
  Card,
  Table,
} from "tabler-react";
// import HasPermissionWrapper from "../../../../HasPermissionWrapper"

import ButtonAdd from '../../../../../ui/ButtonAdd';
import AppSettingsContext from '../../../../../context/AppSettingsContext'
import { GET_ACCOUNT_SUBSCRIPTION_CREDITS_QUERY } from './queries'
import AccountSubscriptionEditListBase from "../AccountSubscriptionEditListBase"
import AccountSubscriptionEditCreditDelete from "./AccountSubscriptionEditCreditDelete"



function AccountSubscriptionEditCredits({t, match, history}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const timeFormat = appSettings.timeFormatMoment
  
  const accountId = match.params.account_id
  const subscriptionId = match.params.subscription_id
  const returnUrl = `/relations/accounts/${accountId}/subscriptions`
  const activeTab = "credits"

  const pageHeaderButtonList = <ButtonAdd
    addUrl={`/relations/accounts/${accountId}/subscriptions/edit/${subscriptionId}/credits/add`} 
    className="ml-2"
  />

  const { loading, error, data, fetchMore } = useQuery(GET_ACCOUNT_SUBSCRIPTION_CREDITS_QUERY, {
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

  const accountSubscriptionCredits = data.accountSubscriptionCredits
  const pageInfo = data.accountSubscriptionCredits.pageInfo

  // Empty list
  if (!accountSubscriptionCredits.edges.length) { return (
    <AccountSubscriptionEditListBase activeTab={activeTab} returnUrl={returnUrl} pageHeaderButtonList={pageHeaderButtonList}>
      <Card.Body>{t('relations.account.subscriptions.credits.empty_list')}</Card.Body>
    </AccountSubscriptionEditListBase>
  )}

  console.table(data)

  function onLoadMore() {
    fetchMore({
      variables: {
        after: accountSubscriptionCredits.pageInfo.endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newEdges = fetchMoreResult.accountSubscriptionCredits.edges
        const pageInfo = fetchMoreResult.accountSubscriptionCredits.pageInfo

        return newEdges.length
          ? {
              // Put the new invoices at the end of the list and update `pageInfo`
              // so we have the new `endCursor` and `hasNextPage` values
              accountSubscriptionCredits: {
                __typename: previousResult.accountSubscriptionCredits.__typename,
                edges: [ ...previousResult.accountSubscriptionCredits.edges, ...newEdges ],
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
            <Table.ColHeader>{t('general.credit')}</Table.ColHeader>
            <Table.ColHeader>{t('general.expiration')}</Table.ColHeader>
            <Table.ColHeader>{t('general.class')}</Table.ColHeader>
            <Table.ColHeader></Table.ColHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
            {accountSubscriptionCredits.edges.map(({ node }) => (
              <Table.Row key={v4()}>
                <Table.Col>
                  {moment(node.createdAt).format(dateFormat)} <br />
                  <small className="text-muted">
                    <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(node.description) }} />
                  </small>
                </Table.Col>
                <Table.Col>
                  {moment(node.expiration).format(dateFormat)} <br />
                  {node.expired && <Badge color="danger">{t("general.expired")}</Badge>}
                </Table.Col>
                <Table.Col>
                  {/* TODO class info here */}
                  { node.scheduleItemAttendance && <span>
                    {moment(node.scheduleItemAttendance.date).format(dateFormat)} {" "}
                    {moment(`${node.scheduleItemAttendance.date} ${node.scheduleItemAttendance.scheduleItem.timeStart}`)
                      .format(timeFormat)} {" "}
                    {" - "}
                    {node.scheduleItemAttendance.scheduleItem.organizationClasstype.name} <br />
                    <small className='text-muted'>
                      {node.scheduleItemAttendance.scheduleItem.organizationLocationRoom.organizationLocation.name}
                    </small>
                    </span>}
                </Table.Col>
                <Table.Col className="text-right">
                  <Link to={`/relations/accounts/${accountId}/subscriptions/edit/${subscriptionId}/credits/edit/${node.id}`}>
                    <Button className='btn-sm' 
                            color="secondary">
                      {t('general.edit')}
                    </Button>
                  </Link>
                  <AccountSubscriptionEditCreditDelete id={node.id} />
                </Table.Col>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </AccountSubscriptionEditListBase>
  )
}

export default withTranslation()(withRouter(AccountSubscriptionEditCredits))
