import React, { useContext } from 'react'
import { useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import { v4 } from 'uuid'


import {
  Button,
  Card,
  Table,
} from "tabler-react";
// import HasPermissionWrapper from "../../../../HasPermissionWrapper"
import AppSettingsContext from '../../../../../context/AppSettingsContext'
import { GET_ACCOUNT_SUBSCRIPTION_PAUSES_QUERY } from './queries'
import AccountSubscriptionEditListBase from "../AccountSubscriptionEditListBase"
import AccountSubscriptionEditPauseDelete from "./AccountSubscriptionEditPauseDelete"
import moment from 'moment';
import ButtonAdd from '../../../../../ui/ButtonAdd';


function AccountSubscriptionEditPauses({t, match, history}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const timeFormat = appSettings.timeFormatMoment
  const dateTimeFormatMoment = appSettings.dateTimeFormatMoment
  console.log(appSettings)
  
  const id = match.params.subscription_id
  const accountId = match.params.account_id
  const subscriptionId = match.params.subscription_id
  const returnUrl = `/relations/accounts/${accountId}/subscriptions`
  const activeTab = "pauses"

  const pageHeaderButtonList = <ButtonAdd 
    addUrl={`/relations/accounts/${accountId}/subscriptions/edit/${subscriptionId}/pauses/add`} 
    className='ml-2'
  />

  const { loading, error, data, fetchMore } = useQuery(GET_ACCOUNT_SUBSCRIPTION_PAUSES_QUERY, {
    variables: {
      accountSubscription: subscriptionId
    }
  })
  
  if (loading) return (
    <AccountSubscriptionEditListBase activeTab={activeTab} returnUrl={returnUrl} pageHeaderButtonList={pageHeaderButtonList} >
      {t("general.loading_with_dots")}
    </AccountSubscriptionEditListBase>
  )
  if (error) return (
    <AccountSubscriptionEditListBase activeTab={activeTab} returnUrl={returnUrl} pageHeaderButtonList={pageHeaderButtonList} >
      <p>{t('general.error_sad_smiley')}</p>
      <p>{error.message}</p>
    </AccountSubscriptionEditListBase>
  )

  console.log('query data')
  console.log(data)

  const accountSubscriptionPauses = data.accountSubscriptionPauses
  const pageInfo = data.accountSubscriptionPauses.pageInfo

    // Empty list
    if (!accountSubscriptionPauses.edges.length) { return (
      <AccountSubscriptionEditListBase activeTab={activeTab} returnUrl={returnUrl} pageHeaderButtonList={pageHeaderButtonList} >
        {/* <div className="pull-right">{buttonAdd}</div> */}
        {/* <h5>{t('relations.account.subscriptions.pauses.title_list')}</h5> */}
        <Card.Body>{t('relations.account.subscriptions.pauses.empty_list')}</Card.Body>
      </AccountSubscriptionEditListBase>
    )}
  // const inputData = data
  // const account = data.account
  // const initialdata = data.accountSubscription

  // let initialPaymentMethod = ""
  // if (initialdata.financePaymentMethod) {
  //   initialPaymentMethod = initialdata.financePaymentMethod.id
  // }

  const onLoadMore = () => {
    fetchMore({
      variables: {
        after: accountSubscriptionPauses.pageInfo.endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newEdges = fetchMoreResult.accountSubscriptionPauses.edges
        const pageInfo = fetchMoreResult.accountSubscriptionPauses.pageInfo

        return newEdges.length
          ? {
              // Put the new invoices at the end of the list and update `pageInfo`
              // so we have the new `endCursor` and `hasNextPage` values
              accountSubscriptionPauses: {
                __typename: previousResult.accountSubscriptionPauses.__typename,
                edges: [ ...previousResult.accountSubscriptionPauses.edges, ...newEdges ],
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
          <Table.Row key={v4()}>{/* <div className="pull-right">{buttonAdd}</div> */}
      {/* <h5>{t('relations.account.subscriptions.pauses.title_list')}</h5> */}
            <Table.ColHeader>{t('general.date_start')}</Table.ColHeader>
            <Table.ColHeader>{t('general.date_end')}</Table.ColHeader>
            <Table.ColHeader>{t('general.description')}</Table.ColHeader>
            <Table.ColHeader></Table.ColHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
            {accountSubscriptionPauses.edges.map(({ node }) => (
              <Table.Row key={v4()}>
                <Table.Col>
                  {moment(node.dateStart).format(dateFormat)}
                </Table.Col>
                <Table.Col>
                  {moment(node.dateEnd).format(dateFormat)}
                </Table.Col>
                <Table.Col>
                <div dangerouslySetInnerHTML={{__html: node.description}} />
                </Table.Col>
                <Table.Col className="text-right">
                  <Link to={`/relations/accounts/${accountId}/subscriptions/edit/${subscriptionId}/pauses/edit/${node.id}`}>
                    <Button className='btn-sm' 
                            color="secondary">
                      {t('general.edit')}
                    </Button>
                  </Link>
                  <AccountSubscriptionEditPauseDelete id={node.id} />
                </Table.Col>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </AccountSubscriptionEditListBase>
  )
}

export default withTranslation()(withRouter(AccountSubscriptionEditPauses))
