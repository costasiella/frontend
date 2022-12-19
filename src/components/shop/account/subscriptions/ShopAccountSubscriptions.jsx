import React, { useContext} from 'react'
import { useQuery } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"
import { v4 } from "uuid"
import moment from 'moment'

import AppSettingsContext from '../../../context/AppSettingsContext'

import {
  Button,
  Card,
  Dimmer,
  Grid,
  Icon,
  Table
} from "tabler-react";
import { QUERY_ACCOUNT_SUBSCRIPTIONS } from "./queries"
import GET_USER_PROFILE from "../../../../queries/system/get_user_profile"
import LoadMoreOnBottomScroll from '../../../general/LoadMoreOnBottomScroll'

import ShopAccountSubscriptionsBase from "./ShopAccountSubscriptionsBase"
import ContentCard from "../../../general/ContentCard"


function ShopAccountSubscriptions({t, match, history}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat

  // Chain queries. First query user data and then query invoices for that user once we have the account Id.
  const { loading: loadingUser, error: errorUser, data: dataUser } = useQuery(GET_USER_PROFILE)
  const { loading, error, data, fetchMore } = useQuery(QUERY_ACCOUNT_SUBSCRIPTIONS, {
    skip: loadingUser || errorUser || !dataUser,
    variables: {
      account: dataUser && dataUser.user ? dataUser.user.accountId : null
    },
    fetchPolicy: "network-only"
  })
  

  if (loading || loadingUser || !data) return (
    <ShopAccountSubscriptionsBase>
      <Dimmer active={true} loader={true} />
    </ShopAccountSubscriptionsBase>
  )
  if (error || errorUser) return (
    <ShopAccountSubscriptionsBase>
      {t("shop.account.subscriptions.error_loading_data")}
    </ShopAccountSubscriptionsBase>
  )

  const user = data.user
  const subscriptions = data.accountSubscriptions

  // Empty list
  if (!subscriptions.edges.length) {
    return (
      <ShopAccountSubscriptionsBase accountName={user.fullName}>
        <Grid.Row>
          <Grid.Col md={12}>
            <Card cardTitle={t('shop.account.subscriptions.title')} >
              <Card.Body>
                {t('shop.account.subscriptions.empty_list')}
              </Card.Body>
            </Card>
          </Grid.Col>
        </Grid.Row>
      </ShopAccountSubscriptionsBase>
    )  
  }

  // Populated list
  return (
    <ShopAccountSubscriptionsBase accountName={user.fullName}>
      <Grid.Row>
        <Grid.Col md={12}>
          <h4>{t('shop.account.subscriptions.title')}</h4>
          <LoadMoreOnBottomScroll
            // headerContent={headerOptions}
            pageInfo={subscriptions.pageInfo}
            onLoadMore={() => {
              fetchMore({
                variables: {
                  after: subscriptions.pageInfo.endCursor
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                  const newEdges = fetchMoreResult.accountSubscriptions.edges
                  const pageInfo = fetchMoreResult.accountSubscriptions.pageInfo

                  return newEdges.length
                    ? {
                        // Put the new subscriptions at the end of the list and update `pageInfo`
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
            {/* <Grid.Row> */}
            { subscriptions.edges.map(({ node }) => (
              <Card key={v4()}>
                <Card.Body>
                  <Grid.Row>
                    <Grid.Col xs={12} md={10}>
                      <div className='mb-xs-3'>
                        <h6>
                          { node.organizationSubscription.name }
                          {/* Perhaps a badge here to indicate active /inactive in the future? */}
                        </h6>
                        <Icon name="calendar" /> { moment(node.dateStart).format(dateFormat) } 
                        { (node.dateEnd) && <span> - {moment(node.dateEnd).format(dateFormat)}</span> }
                      </div>
                    </Grid.Col>
                    <Grid.Col xs={12} md={2}>
                      <Link to={`/shop/account/subscriptions/${node.id}/credits`}>
                        <Button
                          block
                          outline
                          color="info"
                          size="sm"
                        >
                          {node.creditTotal} {t("general.credits")}
                        </Button>
                      </Link>
                    </Grid.Col>
                  </Grid.Row>
                </Card.Body>
              </Card>
            ))}
          </LoadMoreOnBottomScroll>
        </Grid.Col>
      </Grid.Row>
    </ShopAccountSubscriptionsBase>
  )
}


export default withTranslation()(withRouter(ShopAccountSubscriptions))