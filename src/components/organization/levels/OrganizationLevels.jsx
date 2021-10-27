// @flow

import React, { useState } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"



import {
  Icon,
  Dimmer,
  Button,
  Card,
  Table
} from "tabler-react";
import { toast } from 'react-toastify'

import ContentCard from "../../general/ContentCard"
import OrganizationLevelsBase from './OrganizationLevelsBase'

import { GET_LEVELS_QUERY, ARCHIVE_LEVEL } from "./queries"


function OrganizationLevels({t, history}) {
  let [archived, setArchived] = useState(false)
  const cardTitle = t('organization.levels.title')
  const { loading, error, data, refetch, fetchMore } = useQuery(GET_LEVELS_QUERY, {
    variables: { archived: archived }
  })
  const [ archiveLevel ] = useMutation(ARCHIVE_LEVEL)

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
    <OrganizationLevelsBase>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationLevelsBase>
  )

  if (error) return (
    <OrganizationLevelsBase>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('organization.levels.error_loading')}</p>
      </ContentCard>
    </OrganizationLevelsBase>
  )

  let levels = data.organizationLevels

  // Empty list
  if (!levels.edges.length) { return (
    <OrganizationLevelsBase>
      <ContentCard cardTitle={t('organization.levels.title')}
                    headerContent={headerOptions}>
        <p>
          {(!archived) ? t('organization.levels.empty_list') : t("organization.levels.empty_archive")}
        </p>
      </ContentCard>
    </OrganizationLevelsBase>
  )}


  return (
    <OrganizationLevelsBase>
      <ContentCard 
        cardTitle={cardTitle}
        headerContent={headerOptions}
        pageInfo={levels.pageInfo}
        onLoadMore={() => {
        fetchMore({
          variables: {
            after: levels.pageInfo.endCursor
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.organizationLevels.edges
            const pageInfo = fetchMoreResult.organizationLevels.pageInfo

            return newEdges.length
              ? {
                  // Put the new levels at the end of the list and update `pageInfo`
                  // so we have the new `endCursor` and `hasNextPage` values
                  organizationLevels: {
                    __typename: previousResult.organizationLevels.__typename,
                    edges: [ ...previousResult.organizationLevels.edges, ...newEdges ],
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
              {levels.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    {node.name}
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    {(node.archived) ? 
                      <span className='text-muted'>{t('general.unarchive_to_edit')}</span> :
                      <Button className='btn-sm' 
                              onClick={() => history.push("/organization/levels/edit/" + node.id)}
                              color="secondary">
                        {t('general.edit')}
                      </Button>
                    }
                    <button className="icon btn btn-link btn-sm" 
                        title={t('general.archive')} 
                        href=""
                        onClick={() => {
                          console.log("clicked archived")
                          let id = node.id
                          archiveLevel({ variables: {
                            input: {
                            id,
                            archived: !archived
                            }
                    }, refetchQueries: [
                        {query: GET_LEVELS_QUERY, variables: {"archived": archived }}
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
                      <Icon prefix="fe" name="inbox" />
                    </button>
                  </Table.Col>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </OrganizationLevelsBase>
  )
}



export default withTranslation()(withRouter(OrganizationLevels))