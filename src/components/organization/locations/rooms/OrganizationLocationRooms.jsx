// @flow

import React, { useState } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Alert,
  Icon,
  Dimmer,
  Badge,
  Button,
  Card,
  Table
} from "tabler-react";
import { toast } from 'react-toastify'

import ContentCard from "../../../general/ContentCard"

import { GET_LOCATION_ROOMS_QUERY, ARCHIVE_LOCATION_ROOM } from "./queries"
import OrganizationLocationRoomsBase from './OrganizationLocationRoomsBase'


function OrganizationLocationsRooms({ t, history, match }) {
  const organizationLocationId = match.params.location_id
  const cardTitle = t('organization.location_rooms.title')
  let [archived, setArchived] = useState(false)
  const { loading, error, data, refetch, fetchMore } = useQuery(GET_LOCATION_ROOMS_QUERY, {
    variables: { archived: archived, organizationLocation: organizationLocationId }
  })
  const [ archiveLocationRoom ] = useMutation(ARCHIVE_LOCATION_ROOM)

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
    <OrganizationLocationRoomsBase>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationLocationRoomsBase>
  )
  // Error
  if (error) return (
    <OrganizationLocationRoomsBase>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('organization.location_rooms.error_loading')}</p>
      </ContentCard>
    </OrganizationLocationRoomsBase>
  )

  let locationRooms = data.organizationLocationRooms
  let location = data.organizationLocation

  // Empty list
  if (!locationRooms.edges.length) { return (
    <OrganizationLocationRoomsBase>
      <ContentCard cardTitle={cardTitle}
                  headerContent={headerOptions}>
        <p>
          {(!archived) ? t('organization.location_rooms.empty_list') : t("organization.location_rooms.empty_archive")}
        </p>
      </ContentCard>
    </OrganizationLocationRoomsBase>
  )}

  return (
    <OrganizationLocationRoomsBase>
      <ContentCard 
        cardTitle={cardTitle}
                    headerContent={headerOptions}
                    hasCardBody={false}
                    pageInfo={locationRooms.pageInfo}
                    onLoadMore={() => {
                    fetchMore({
                      variables: {
                        after: locationRooms.pageInfo.endCursor
                      },
                      updateQuery: (previousResult, { fetchMoreResult }) => {
                        const newEdges = fetchMoreResult.organizationLocationsRooms.edges
                        const pageInfo = fetchMoreResult.organizationLocationsRooms.pageInfo

                        return newEdges.length
                          ? {
                              // Put the new locations at the end of the list and update `pageInfo`
                              // so we have the new `endCursor` and `hasNextPage` values
                              organizationLocationsRooms: {
                                __typename: previousResult.organizationLocationsRooms.__typename,
                                edges: [ ...previousResult.organizationLocationsRooms.edges, ...newEdges ],
                                pageInfo
                              }
                            }
                          : previousResult
                      }
                    })
                  }} >
        <div>
          <Alert type="primary">
            <strong>{t('general.location')}</strong> {location.name}
          </Alert>

          <Table cards>
            <Table.Header>
              <Table.Row key={v4()}>
                <Table.ColHeader>{t('general.name')}</Table.ColHeader>
                <Table.ColHeader>{t('general.public')}</Table.ColHeader>
                <Table.ColHeader></Table.ColHeader>
                <Table.ColHeader></Table.ColHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
                {locationRooms.edges.map(({ node }) => (
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
                        <Button className='btn-sm' 
                                onClick={() => history.push("/organization/locations/rooms/edit/" + match.params.location_id + '/' + node.id)}
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
                              archiveLocationRoom({ variables: {
                                input: {
                                id,
                                archived: !archived
                                }
                        }, refetchQueries: [
                            { 
                              query: GET_LOCATION_ROOMS_QUERY, 
                              variables: {archived: archived, organizationLocation: organizationLocationId }
                            }
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
          </div>
      </ContentCard>
    </OrganizationLocationRoomsBase>
  )
}

export default withTranslation()(withRouter(OrganizationLocationsRooms))