// @flow

import React, { useState } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'


import {
  Icon,
  Dimmer,
  Button,
  Card,
  Table
} from "tabler-react";
import { toast } from 'react-toastify'

import BadgeBoolean from "../../ui/BadgeBoolean"
import ContentCard from "../../general/ContentCard"
import OrganizationSubscriptionsBase from './OrganizationSubscriptionsBase'

import { GET_SUBSCRIPTIONS_QUERY, ARCHIVE_SUBSCRIPTION } from "./queries"


function OrganizationSubscriptions({t, history}) {
  const cardTitle = t('organization.subscriptions.title')
  let [archived, setArchived] = useState(false)
  const {loading, error, data, refetch, fetchMore} = useQuery(GET_SUBSCRIPTIONS_QUERY, {
    variables: {archived: archived}
  })
  const [archiveSubscription] = useMutation(ARCHIVE_SUBSCRIPTION)
  const headerOptions = <Card.Options>
    <Button color={(!archived) ? 'primary': 'secondary'}  
            size="sm"
            onClick={() => {setArchived(false); refetch({archived: archived});}}>
      {t('general.current')}
    </Button>
    <Button color={(archived) ? 'primary': 'secondary'} 
            size="sm" 
            className="ml-2" 
            onClick={() => {setArchived(true); refetch({archived: archived});}}>
      {t('general.archive')}
    </Button>
  </Card.Options>

  if (loading) return (
    <OrganizationSubscriptionsBase>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationSubscriptionsBase>
  )

  if (error) return (
    <OrganizationSubscriptionsBase>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('organization.subscriptions.error_loading')}</p>
      </ContentCard>
    </OrganizationSubscriptionsBase>
  )

  let subscriptions = data.organizationSubscriptions

  // Empty list
  if (!subscriptions.edges.length) { return (
    <OrganizationSubscriptionsBase>
      <ContentCard cardTitle={cardTitle}
                    headerContent={headerOptions}>
        <p>
          {(!archived) ? t('organization.subscriptions.empty_list') : t("organization.subscriptions.empty_archive")}
        </p>
      </ContentCard>
    </OrganizationSubscriptionsBase>
  )}

  return (
    <OrganizationSubscriptionsBase>
      <ContentCard cardTitle={t('organization.subscriptions.title')}
                  headerContent={headerOptions}
                  pageInfo={subscriptions.pageInfo}
                  onLoadMore={() => {
                    fetchMore({
                      variables: {
                        after: subscriptions.pageInfo.endCursor
                      },
                      updateQuery: (previousResult, { fetchMoreResult }) => {
                        const newEdges = fetchMoreResult.organizationSubscriptions.edges
                        const pageInfo = fetchMoreResult.organizationSubscriptions.pageInfo

                        return newEdges.length
                          ? {
                              // Put the new subscriptions at the end of the list and update `pageInfo`
                              // so we have the new `endCursor` and `hasNextPage` values
                              organizationSubscriptions: {
                                __typename: previousResult.organizationSubscriptions.__typename,
                                edges: [ ...previousResult.organizationSubscriptions.edges, ...newEdges ],
                                pageInfo
                              }
                            }
                          : previousResult
                      }
                    })
                  }} >
        <Table>
          <Table.Header>
            <Table.Row key={v4()}>
              <Table.ColHeader>{t('general.name')}</Table.ColHeader>
              <Table.ColHeader>{t('general.public')}</Table.ColHeader>
              <Table.ColHeader>{t('general.shop')}</Table.ColHeader>
              <Table.ColHeader>{t('general.classes')}</Table.ColHeader>
              <Table.ColHeader><span className="pull-right">{t('general.price')}</span></Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {subscriptions.edges.map(({ node }) => (
              <Table.Row key={v4()}>
                <Table.Col key={v4()}>
                  {node.name}
                </Table.Col>
                <Table.Col key={v4()}>
                  <BadgeBoolean value={node.displayPublic} />
                </Table.Col>
                <Table.Col key={v4()}>
                  <BadgeBoolean value={node.displayShop} />
                </Table.Col>
                <Table.Col key={v4()}>
                  {
                    (node.unlimited) ? t("general.unlimited"):
                    <div>
                      {node.classes} <br />
                      <span className="text-muted"> {t("general.a")} {node.subscriptionUnitDisplay}</span>
                    </div>
                  }
                </Table.Col>
                <Table.Col className="text-right" key={v4()}>
                  {node.priceTodayDisplay} <br />
                  <Link to={"/organization/subscriptions/prices/" + node.id}
                        className='btn btn-link btn-sm'>
                      {/* <Icon prefix="fe" name="dollar-sign" />  */}
                      {t('general.edit_price')}
                  </Link>
                </Table.Col>
                <Table.Col className="text-right" key={v4()}>
                  {(node.archived) ? 
                    <span className='text-muted'>{t('general.unarchive_to_edit')}</span> :
                    <Button className='btn-sm' 
                            onClick={() => history.push("/organization/subscriptions/edit/" + node.id)}
                            color="secondary">
                      {t('general.edit')}
                    </Button>
                  }
                </Table.Col>
                <Table.Col className="text-right" key={v4()}>
                  <button className="icon btn btn-link btn-sm" 
                      title={t('general.archive')} 
                      href=""
                      onClick={() => {
                        console.log("clicked archived")
                        let id = node.id
                        archiveSubscription({ variables: {
                          input: {
                          id,
                          archived: !archived
                          }
                  }, refetchQueries: [
                      {query: GET_SUBSCRIPTIONS_QUERY, variables: {"archived": archived }}
                  ]}).then(({ data }) => {
                    console.log('got data', data);
                    toast.success(
                      (archived) ? t('general.unarchived'): t('general.archived'), {
                        position: toast.POSITION.BOTTOM_RIGHT
                      })
                  }).catch((error) => {
                    toast.error((t('general.toast_server_error')) +  error, {
                        position: toast.POSITION.BOTTOM_RIGHT
                      })
                    console.log('there was an error sending the query', error);
                  })
                  }}>
                    <Icon prefix="fa" name="inbox" />
                  </button>
                </Table.Col>
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
    </ContentCard>
  </OrganizationSubscriptionsBase>
)}


export default withTranslation()(withRouter(OrganizationSubscriptions))