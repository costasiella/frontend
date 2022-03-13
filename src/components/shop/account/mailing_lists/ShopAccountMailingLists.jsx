import React from 'react'
import { useQuery } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { v4 } from "uuid"
import {
  Card,
  Grid,
  Table
} from "tabler-react";

import { QUERY_SYSTEM_MAILCHIMP_LISTS } from "./queries"
import GET_USER_PROFILE from "../../../../queries/system/get_user_profile"
import ShopAccountMailingListsBase from "./ShopAccountMailingListsBase"
import ContentCard from "../../../general/ContentCard"


function ShopAccountMailingLists({t, match, history}) {
  const { loading: loadingUser, error: errorUser, data: dataUser } = useQuery(GET_USER_PROFILE)
  const { loading, error, data, fetchMore } = useQuery(QUERY_SYSTEM_MAILCHIMP_LISTS, {
    skip: loadingUser || errorUser || !dataUser,
    variables: {
      account: dataUser && dataUser.user ? dataUser.user.accountId : null
    }
  })

  if (loading || loadingUser || !data) return (
    <ShopAccountMailingListsBase>
      {t("general.loading_with_dots")}
    </ShopAccountMailingListsBase>
  )
  if (error || errorUser) return (
    <ShopAccountMailingListsBase>
      {t("shop.account.mailing_lists.error_loading_data")}
    </ShopAccountMailingListsBase>
  )

  const user = data.user
  const mailingLists = data.systemMailchimpLists

  // Empty list
  if (!mailingLists.edges.length) {
    return (
      <ShopAccountMailingListsBase accountName={user.fullName}>
        <Grid.Row>
          <Grid.Col md={12}>
            <Card cardTitle={t('shop.account.mailing_lists.title')} >
              <Card.Body>
                {t('shop.account.mailing_lists.empty_list')}
              </Card.Body>
            </Card>
          </Grid.Col>
        </Grid.Row>
      </ShopAccountMailingListsBase>
    )  
  }

  // Populated list
  return (
    <ShopAccountMailingListsBase accountName={user.fullName}>
      <Grid.Row>
        <Grid.Col md={12}>
          <ContentCard cardTitle={t('shop.account.mailing_lists.title')}
            hasCardBody={false}
            pageInfo={mailingLists.pageInfo}
            onLoadMore={() => {
              fetchMore({
                variables: {
                  after: mailingLists.pageInfo.endCursor
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                  const newEdges = fetchMoreResult.systemMailchimpLists.edges
                  const pageInfo = fetchMoreResult.systemMailchimpLists.pageInfo

                  return newEdges.length
                    ? {
                        // Put the new subscriptions at the end of the list and update `pageInfo`
                        // so we have the new `endCursor` and `hasNextPage` values
                        systemMailchimpLists: {
                          __typename: previousResult.systemMailchimpLists.__typename,
                          edges: [ ...previousResult.systemMailchimpLists.edges, ...newEdges ],
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
                  <Table.ColHeader>{t('general.name')}</Table.ColHeader>
                  <Table.ColHeader>{t('general.frequency')}</Table.ColHeader>
                  <Table.ColHeader>{t('general.description')}</Table.ColHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {mailingLists.edges.map(({ node }) => (
                  <Table.Row key={v4()}>
                    <Table.Col>
                      {node.name}
                    </Table.Col>
                    <Table.Col>
                      {node.frequency}
                    </Table.Col>
                    <Table.Col>
                      <div dangerouslySetInnerHTML={{ __html: node.description}} />
                    </Table.Col>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </ContentCard>
        </Grid.Col>
      </Grid.Row>
    </ShopAccountMailingListsBase>
  )
}


export default withTranslation()(withRouter(ShopAccountMailingLists))