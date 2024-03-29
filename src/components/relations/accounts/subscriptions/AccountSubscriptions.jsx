import React, { useContext } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import moment from 'moment'

import {
  Icon,
  Button,
  Card,
  Table
} from "tabler-react";
import HasPermissionWrapper from "../../../HasPermissionWrapper"

import confirm_delete from "../../../../tools/confirm_delete"

import AppSettingsContext from '../../../context/AppSettingsContext'
import ContentCard from "../../../general/ContentCard"
import RelationsAccountProfileBase from '../RelationsAccountProfileBase'
import ButtonAdd from "../../../ui/ButtonAdd"

import { GET_ACCOUNT_SUBSCRIPTIONS_QUERY, DELETE_ACCOUNT_SUBSCRIPTION } from "./queries"


function AccountSubscriptions({t, match}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat

  const accountId = match.params.account_id
  const cardTitle = t('relations.account.subscriptions.title')
  const activeLink = "subscriptions"
  const { loading, error, data, fetchMore } = useQuery(GET_ACCOUNT_SUBSCRIPTIONS_QUERY, {
    variables: {accountId: accountId},
    fetchPolicy: "network-only"
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
  const pageHeaderButtonList = <HasPermissionWrapper 
    permission="add"
    resource="accountsubscription">
      <ButtonAdd addUrl={`/relations/accounts/${accountId}/subscriptions/add`} className='ml-2' />
  </HasPermissionWrapper>

  // Empty list
  if (!accountSubscriptions.edges.length) {
    return (
      <RelationsAccountProfileBase
        activeLink={activeLink}
        user={account}
        pageHeaderButtonList={pageHeaderButtonList}
      >
        <Card title={cardTitle}>
          <Card.Body>
            <p>{t('relations.account.subscriptions.empty_list')}</p>
          </Card.Body>
        </Card>
      </RelationsAccountProfileBase>
    )
  }

  console.table(accountSubscriptions.edges)

  return (
    <RelationsAccountProfileBase
      activeLink={activeLink}
      user={account}
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <ContentCard 
        cardTitle={t('relations.account.subscriptions.title')}
        pageInfo={accountSubscriptions.pageInfo}
        hasCardBody={false}
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
        <Table cards>
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
                    {moment(node.dateStart).format(dateFormat)}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.dateEnd && moment(node.dateEnd).format(dateFormat)}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {(node.financePaymentMethod) ? node.financePaymentMethod.name : ""}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    { (node.organizationSubscription.unlimited) ? t("general.unlimited") : node.creditTotal }
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    <Link to={"/relations/accounts/" + match.params.account_id + "/subscriptions/edit/" + node.id}>
                      <Button className='btn-sm' 
                              color="secondary">
                        {t('general.edit')}
                      </Button>
                    </Link>
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