// @flow

import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'


import {
  Icon,
  Button,
  Card,
  Table
} from "tabler-react";
import HasPermissionWrapper from "../../../HasPermissionWrapper"

import BadgeBoolean from "../../../ui/BadgeBoolean"
import confirm_delete from "../../../../tools/confirm_delete"

import ContentCard from "../../../general/ContentCard"
import RelationsAccountProfileBase from '../RelationsAccountProfileBase'

import { GET_ACCOUNT_SUBSCRIPTIONS_QUERY, DELETE_ACCOUNT_SUBSCRIPTION } from "./queries"


function AccountSubscriptions({t, match}) {
  const accountId = match.params.account_id
  const cardTitle = t('relations.account.subscriptions.title')
  const activeLink = "subscriptions"
  const { loading, error, data, fetchMore } = useQuery(GET_ACCOUNT_SUBSCRIPTIONS_QUERY, {
    variables: {accountId: accountId}
  })
  const [deleteAccountSubscription] = useMutation(DELETE_ACCOUNT_SUBSCRIPTION)

  if (loading) return(
    <RelationsAccountProfileBase activeLink={activeLink}>
      <Card title={cardTitle}>
        {t('general.loading_with_dots')}
      </Card>
    </RelationsAccountProfileBase>
  )

  if (error) return(
    <RelationsAccountProfileBase activeLink={activeLink}>
      {console.log(error)}
      <Card title={cardTitle}>
        {t('general.error_sad_smiley')}
      </Card>
    </RelationsAccountProfileBase>
  )

  const account = data.account
  const accountSubscriptions = data.accountSubscriptions
  const sidebarButton = <HasPermissionWrapper 
    permission="add"
    resource="accountsubscription">
      <Link to={"/relations/accounts/" + match.params.account_id + "/subscriptions/add"}>
      <Button color="primary btn-block mb-6">
      {/* //  onClick={() => history.push("/organization/subscriptions/add")}> */}
      <Icon prefix="fe" name="plus-circle" /> {t('relations.account.subscriptions.add')}
      </Button>
      </Link>
  </HasPermissionWrapper>

  return (
    <RelationsAccountProfileBase
      activeLink={activeLink}
      user={account}
      sidebarButton={sidebarButton}
    >
      <ContentCard 
        cardTitle={t('relations.account.subscriptions.title')}
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
                    // Put the new accountSubscriptions at the end of the list and update `pageInfo`
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
        }} 
      >
        <Table>
          <Table.Header>
            <Table.Row key={v4()}>
              <Table.ColHeader>{t('general.name')}</Table.ColHeader>
              <Table.ColHeader>{t('general.date_start')}</Table.ColHeader>
              <Table.ColHeader>{t('general.date_end')}</Table.ColHeader>
              <Table.ColHeader>{t('general.payment_method')}</Table.ColHeader>
              <Table.ColHeader>{t('general.credits')}</Table.ColHeader>
              <Table.ColHeader></Table.ColHeader> 
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {accountSubscriptions.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    {node.organizationSubscription.name}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.dateStart}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.dateEnd}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {(node.financePaymentMethod) ? node.financePaymentMethod.name : ""}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.creditTotal}
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    <Link to={"/relations/accounts/" + match.params.account_id + "/subscriptions/edit/" + node.id}>
                      <Button className='btn-sm' 
                              color="secondary">
                        {t('general.edit')}
                      </Button>
                    </Link>
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    <button className="icon btn btn-link btn-sm" 
                      title={t('general.delete')} 
                      href=""
                      onClick={() => {
                        confirm_delete({
                          t: t,
                          msgConfirm: t("relations.account.subscriptions.delete_confirm_msg"),
                          msgDescription: <p>{node.organizationSubscription.name} {node.dateStart}</p>,
                          msgSuccess: t('relations.account.subscriptions.deleted'),
                          deleteFunction: deleteAccountSubscription,
                          functionVariables: { variables: {
                            input: {
                              id: node.id
                            }
                          }, refetchQueries: [
                            {query: GET_ACCOUNT_SUBSCRIPTIONS_QUERY, variables: { accountId: accountId }} 
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
    </RelationsAccountProfileBase>
  )
}

        
export default withTranslation()(withRouter(AccountSubscriptions))