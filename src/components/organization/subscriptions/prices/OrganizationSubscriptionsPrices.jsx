import React, { useContext } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { confirmAlert } from 'react-confirm-alert'
import moment from 'moment'


import {
  Card,
  Dimmer,
  Page,
  Grid,
  Icon,
  Button,
  Container,
  Table
} from "tabler-react";
import SiteWrapper from "../../../SiteWrapper"
import HasPermissionWrapper from "../../../HasPermissionWrapper"

import AppSettingsContext from '../../../context/AppSettingsContext'
import ContentCard from "../../../general/ContentCard"

import OrganizationSubscriptionsPricesBase from './OrganizationSubscriptionsPricesBase'
import { GET_SUBSCRIPTION_PRICES_QUERY, DELETE_SUBSCRIPTION_PRICE } from "./queries"
import { GET_SUBSCRIPTIONS_QUERY } from "../queries"

import AlertInfo from "../../../ui/AlertInfo"
import ButtonDelete from '../../../ui/ButtonDelete'


const confirmDelete = (t, match, deleteSubscriptionPrice, node) => {
  console.log("clicked delete")
  let id = node.id

  confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className='custom-ui'>
          <h1>{t('general.confirm_delete')}</h1>
          <p>{t('organization.subscription_prices.delete_confirm_msg')}</p>
          <p>
            {node.priceDisplay} {node.financeTaxRate.name} <br />
            <span className="text-muted">
              {node.dateStart} {(node.dateEnd) ? ' - ' + node.dateEnd : ""}
            </span>
          </p>
          <button className="btn btn-link pull-right" onClick={onClose}>{t('general.confirm_delete_no')}</button>
          <button
            className="btn btn-danger"
            onClick={() => {
            deleteSubscriptionPrice({ variables: {
                input: {
                id
                }
              }, refetchQueries: [
                  {query: GET_SUBSCRIPTION_PRICES_QUERY, variables: { organizationSubscription: match.params.subscription_id }},
                  {query: GET_SUBSCRIPTIONS_QUERY, variables: {archived: false}},
              ]}).then(({ data }) => {
                console.log('got data', data);
                toast.success(
                  t('organization.subscription_prices.deleted'), {
                    position: toast.POSITION.BOTTOM_RIGHT
                  })
              }).catch((error) => {
                toast.error((t('general.toast_server_error')) +  error, {
                    position: toast.POSITION.BOTTOM_RIGHT
                  })
                console.log('there was an error sending the query', error);
              })
              onClose()
            }}
          >
            <Icon name="trash-2" /> {t('general.confirm_delete_yes')}
          </button>
          
        </div>
      );
    }
  })
}


function OrganizationSubscriptionsPrices ({ t, history, match, archived=false }) {
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
    <OrganizationSubscriptionsPricesBase>
        <Card title={cardTitle}>
          <Card.Body>
            <Dimmer active={true} loader={true} />
          </Card.Body>
        </Card>
    </OrganizationSubscriptionsPricesBase>
  )

  if (error) return (
    <OrganizationSubscriptionsPricesBase>
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
    <OrganizationSubscriptionsPricesBase>
      <Card title={cardTitle}>
        <Card.Body>
          {t('organization.subscription_prices.empty_list')}
        </Card.Body>
      </Card>
    </OrganizationSubscriptionsPricesBase>
  )

  return (
    <OrganizationSubscriptionsPricesBase>
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
                              onClick={() => history.push("/organization/subscriptions/prices/edit/" + match.params.subscription_id + '/' + node.id)}
                              color="secondary">
                        {t('general.edit')}
                      </Button>
                    }
                  </Table.Col>
                  {/* <Mutation mutation={DELETE_SUBSCRIPTION_PRICE} key={v4()}>
                      {(deleteSubscriptionPrice, { data }) => (
                        <Table.Col className="text-right" key={v4()}>
                          <button className="icon btn btn-link btn-sm" 
                            title={t('general.delete')} 
                            href=""
                            onClick={() => {confirmDelete(t, match, deleteSubscriptionPrice, node)}}
                          >
                            <span className="text-red">
                              <Icon prefix="fe" name="trash-2" />
                            </span>
                          </button>
                        </Table.Col>
                      )}
                    </Mutation> */}
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </OrganizationSubscriptionsPricesBase>
  )
}

export default withTranslation()(withRouter(OrganizationSubscriptionsPrices))