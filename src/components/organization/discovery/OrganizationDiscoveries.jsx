// @flow

import React, { useState } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"


import {
  Page,
  Grid,
  Icon,
  Dimmer,
  Badge,
  Button,
  Card,
  Container,
  Table
} from "tabler-react";
import { toast } from 'react-toastify'

import ContentCard from "../../general/ContentCard"

import { GET_DISCOVERIES_QUERY, ARCHIVE_DISCOVERY } from "./queries"
import OrganizationDiscoveriesBase from './OrganizationDiscoveriesBase'


function OrganizationDiscoveries({ t, history }) {
  let [archived, setArchived] = useState(false)
  const cardTitle = t('organization.discoveries.title')
  const { loading, error, data, refetch, fetchMore } = useQuery(GET_DISCOVERIES_QUERY, {
    variables: { archived: archived }
  })
  const [ archiveDiscovery ] = useMutation(ARCHIVE_DISCOVERY)

  const headerOptions = <Card.Options>
    <Button color={(!archived) ? 'primary': 'secondary'}  
            size="sm"
            onClick={() => {setArchived(false); refetch({archived: false});}}>
      {t('general.current')}
    </Button>
    <Button color={(archived) ? 'primary': 'secondary'} 
            size="sm" 
            className="ml-2" 
            onClick={() => {setArchived(true); refetch({archived: true});}}>
      {t('general.archive')}
    </Button>
  </Card.Options>

  if (loading) return (
    <OrganizationDiscoveriesBase>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationDiscoveriesBase>
  )

  if (error) return (
    <OrganizationDiscoveriesBase>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('organization.discoveries.error_loading')}</p>
      </ContentCard>
    </OrganizationDiscoveriesBase>
  )

  const discoveries = data.organizationDiscoveries

  // Empty list
  if (!discoveries.edges.length) { return (
    <OrganizationDiscoveriesBase>
      <ContentCard cardTitle={cardTitle}
                  headerContent={headerOptions}>
        <p> 
          {(!archived) ? t('organization.discoveries.empty_list') : t("organization.discoveries.empty_archive")}
        </p>
      </ContentCard>
    </OrganizationDiscoveriesBase>
  )}

  return (
    <OrganizationDiscoveriesBase>
      <ContentCard cardTitle={cardTitle}
                    headerContent={headerOptions}
                    pageInfo={discoveries.pageInfo}
                    onLoadMore={() => {
                    fetchMore({
                      variables: {
                        after: discoveries.pageInfo.endCursor
                      },
                      updateQuery: (previousResult, { fetchMoreResult }) => {
                        const newEdges = fetchMoreResult.organizationDiscoveries.edges
                        const pageInfo = fetchMoreResult.organizationDiscoveries.pageInfo

                        return newEdges.length
                          ? {
                              // Put the new discoveries at the end of the list and update `pageInfo`
                              // so we have the new `endCursor` and `hasNextPage` values
                              organizationDiscoveries: {
                                __typename: previousResult.organizationDiscoveries.__typename,
                                edges: [ ...previousResult.organizationDiscoveries.edges, ...newEdges ],
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
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {discoveries.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    {node.name}
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    {(node.archived) ? 
                      <span className='text-muted'>{t('general.unarchive_to_edit')}</span> :
                      <Button className='btn-sm' 
                              onClick={() => history.push("/organization/discoveries/edit/" + node.id)}
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
                          archiveDiscovery({ variables: {
                            input: {
                            id,
                            archived: !archived
                            }
                    }, refetchQueries: [
                        {query: GET_DISCOVERIES_QUERY, variables: {"archived": archived }}
                    ]}).then(({ data }) => {
                      console.log('got data', data);
                      toast.success(
                        (archived) ? t('general.unarchived'): t('general.archived'), {
                          position: toast.POSITION.BOTTOM_RIGHT
                        })
                    }).catch((error) => {
                      toast.error((t('general.toast_server_error')) + ': ' +  error, {
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
    </OrganizationDiscoveriesBase>
  ) 
}


export default withTranslation()(withRouter(OrganizationDiscoveries))