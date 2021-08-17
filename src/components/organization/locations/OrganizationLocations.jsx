// @flow

import React, { useState } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"


import {
  Icon,
  Dimmer,
  Badge,
  Button,
  Card,
  Table
} from "tabler-react";
import { toast } from 'react-toastify'

import ContentCard from "../../general/ContentCard"

import { GET_LOCATIONS_QUERY, ARCHIVE_LOCATION } from "./queries"
import OrganizationLocationsBase from "./OrganizationLocationsBase"

function OrganizationLocations({t, history}) {
  let [archived, setArchived] = useState(false)
  const cardTitle = t('organization.locations.title')
  const { loading, error, data, refetch, fetchMore } = useQuery(GET_LOCATIONS_QUERY, {
    variables: { archived: archived }
  })
  const [ archiveLocation ] = useMutation(ARCHIVE_LOCATION)

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

  // Loading
  if (loading) return (
    <OrganizationLocationsBase>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationLocationsBase>
  )
  // Error
  if (error) return (
    <OrganizationLocationsBase>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('organization.locations.error_loading')}</p>
      </ContentCard>
    </OrganizationLocationsBase>
  )

  let locations = data.organizationLocations

  // Empty list
  if (!locations.edges.length) { return (
    <OrganizationLocationsBase>
      <ContentCard cardTitle={cardTitle}
                  headerContent={headerOptions}>
        <p>
        {(!archived) ? t('organization.locations.empty_list') : t("organization.locations.empty_archive")}
        </p>
      </ContentCard>
    </OrganizationLocationsBase>
  )}

  return (
    <OrganizationLocationsBase>
      <ContentCard cardTitle={cardTitle}
                headerContent={headerOptions}
                pageInfo={locations.pageInfo}
                onLoadMore={() => {
                fetchMore({
                  variables: {
                    after: locations.pageInfo.endCursor
                  },
                  updateQuery: (previousResult, { fetchMoreResult }) => {
                    const newEdges = fetchMoreResult.organizationLocations.edges
                    const pageInfo = fetchMoreResult.organizationLocations.pageInfo

                    return newEdges.length
                      ? {
                          // Put the new locations at the end of the list and update `pageInfo`
                          // so we have the new `endCursor` and `hasNextPage` values
                          organizationLocations: {
                            __typename: previousResult.organizationLocations.__typename,
                            edges: [ ...previousResult.organizationLocations.edges, ...newEdges ],
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
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {locations.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    {node.name}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {(node.displayPublic) ? 
                      <Badge color="success">{t('general.yes')}</Badge>: 
                      <Badge color="danger">{t('general.no')}</Badge>}
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    {(node.archived) ? 
                      <span className='text-muted'>{t('general.unarchive_to_edit')}</span> :
                      <div>
                        <Button className='btn-sm' 
                                onClick={() => history.push("/organization/locations/edit/" + node.id)}
                                color="secondary">
                          {t('general.edit')}
                        </Button>
                        <Button className='btn-sm' 
                                onClick={() => history.push("/organization/locations/rooms/" + node.id)}
                                color="secondary">
                          {t('general.rooms')}
                        </Button>
                      </div>
                    }
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    <button className="icon btn btn-link btn-sm" 
                        title={t('general.archive')} 
                        href=""
                        onClick={() => {
                          console.log("clicked archived")
                          let id = node.id
                          archiveLocation({ variables: {
                            input: {
                            id,
                            archived: !archived
                            }
                    }, refetchQueries: [
                        {query: GET_LOCATIONS_QUERY, variables: {"archived": archived }}
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
    </OrganizationLocationsBase>
  )
}

export default withTranslation()(withRouter(OrganizationLocations))