import React, { useContext } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import moment from 'moment'

import {
  Card,
  Dimmer,
  Button,
  Table
} from "tabler-react";

import AppSettingsContext from '../../../context/AppSettingsContext'
import ContentCard from "../../../general/ContentCard"

import OrganizationSubscriptionsPricesBase from './OrganizationSubscriptionsPricesBase'
import { GET_SUBSCRIPTION_PRICES_QUERY, DELETE_SUBSCRIPTION_PRICE } from "./queries"
import { GET_SUBSCRIPTIONS_QUERY } from "../queries"

import ButtonDelete from '../../../ui/ButtonDelete'


function OrganizationSubscriptionsPrices ({ t, history, match }) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const subscriptionId = match.params.subscription_id
  let cardTitle = t('organization.subscription_prices.title')

  const { loading, error, data, fetchMore } = useQuery(GET_SUBSCRIPTION_PRICES_QUERY, {
    variables: {
      organizationSubscription: subscriptionId
    }
  })
  const [deleteSubscriptionPrice] = useMutation(DELETE_SUBSCRIPTION_PRICE)

  if (loading) return (
    <OrganizationSubscriptionsPricesBase showAdd={true}>
        <Card title={cardTitle}>
          <Card.Body>
            <Dimmer active={true} loader={true} />
          </Card.Body>
        </Card>
    </OrganizationSubscriptionsPricesBase>
  )

  if (error) return (
    <OrganizationSubscriptionsPricesBase showAdd={true}>
        <Card title={cardTitle}>
          <Card.Body>
            <p>{t('organization.subscription_prices.error_loading')}</p>
          </Card.Body>
        </Card>
    </OrganizationSubscriptionsPricesBase>
  )

  const subscriptionPrices = data.organizationSubscriptionPrices
  cardTitle = `${cardTitle} - ${data.organizationSubscription.name}`
  

  if (!subscriptionPrices.edges.length) return (
    <OrganizationSubscriptionsPricesBase showAdd={true}>
      <Card title={cardTitle}>
        <Card.Body>
          {t('organization.subscription_prices.empty_list')}
        </Card.Body>
      </Card>
    </OrganizationSubscriptionsPricesBase>
  )

  return (
    <OrganizationSubscriptionsPricesBase showAdd={true}>
      <ContentCard cardTitle={cardTitle}
        pageInfo={subscriptionPrices.pageInfo}
        hasCardBody={false}
        onLoadMore={() => {
          fetchMore({
            variables: {
              after: subscriptionPrices.pageInfo.endCursor
            },
            updateQuery: (previousResult, { fetchMoreResult }) => {
              const newEdges = fetchMoreResult.organizationSubscriptionsPrices.edges
              const pageInfo = fetchMoreResult.organizationSubscriptionsPrices.pageInfo

              return newEdges.length
                ? {
                    // Put the new subscriptions at the end of the list and update `pageInfo`
                    // so we have the new `endCursor` and `hasNextPage` values
                    organizationSubscriptionsPrices: {
                      __typename: previousResult.organizationSubscriptionsPrices.__typename,
                      edges: [ ...previousResult.organizationSubscriptionsPrices.edges, ...newEdges ],
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
              <Table.ColHeader>{t('general.date_start')}</Table.ColHeader>
              <Table.ColHeader>{t('general.date_end')}</Table.ColHeader>
              <Table.ColHeader>{t('general.price')}</Table.ColHeader>
              <Table.ColHeader></Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {subscriptionPrices.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    {moment(node.dateStart).format(dateFormat)}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {(node.dateEnd) ? moment(node.dateEnd).format(dateFormat) : ""}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.priceDisplay} <br />
                    <span className="text-muted">{node.financeTaxRate.name}</span>
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    {(node.archived) ? 
                      <span className='text-muted'>{t('general.unarchive_to_edit')}</span> :
                      <Button className='btn-sm' 
                              onClick={() => history.push("/organization/subscriptions/prices/edit/" + subscriptionId + '/' + node.id)}
                              color="secondary">
                        {t('general.edit')}
                      </Button>
                    }
                    <ButtonDelete 
                      msgConfirm={t('organization.subscription_prices.delete_confirm_msg')}
                      msgDescription={<p>
                        {node.priceDisplay} {node.financeTaxRate.name} <br />
                        <span className="text-muted">
                          {node.dateStart} {(node.dateEnd) ? ' - ' + node.dateEnd : ""}
                        </span>
                      </p>}
                      msgSuccess={t('organization.subscription_prices.deleted')}
                      deleteFunction={deleteSubscriptionPrice}
                      deleteFunctionVariables={{ variables: {
                        input: {
                          id: node.id
                        }
                      }, refetchQueries: [
                          {query: GET_SUBSCRIPTION_PRICES_QUERY, variables: { organizationSubscription: subscriptionId }},
                          {query: GET_SUBSCRIPTIONS_QUERY, variables: {archived: false}},
                      ]}}
                    />
                  </Table.Col>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </OrganizationSubscriptionsPricesBase>
  )
}

export default withTranslation()(withRouter(OrganizationSubscriptionsPrices))