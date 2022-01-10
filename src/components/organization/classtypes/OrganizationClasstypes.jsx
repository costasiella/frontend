import React, { useState } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Avatar,
  Icon,
  Dimmer,
  Badge,
  Button,
  Card,
  Table
} from "tabler-react";
// import { confirmAlert } from 'react-confirm-alert'; // Import
import { toast } from 'react-toastify'

import CSLS from "../../../tools/cs_local_storage"
import ContentCard from "../../general/ContentCard"

import { get_list_query_variables } from './tools'
import { GET_CLASSTYPES_QUERY, ARCHIVE_CLASSTYPE } from "./queries"
import OrganizationClasstypesBase from "./OrganizationClasstypesBase"


function OrganizationClasstypes({t, history}) {
  let [archived, setArchived] = useState(false)
  const {loading, error, data, refetch, fetchMore} = useQuery(GET_CLASSTYPES_QUERY, { 
    variables: get_list_query_variables()
  })
  const [archiveClasstype] = useMutation(ARCHIVE_CLASSTYPE)

  if (loading) return (
    <OrganizationClasstypesBase>
      <ContentCard cardTitle={t('organization.classtypes.title')}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationClasstypesBase>
  )
  // Error
  if (error) return (
    <OrganizationClasstypesBase>
      <ContentCard cardTitle={t('organization.classtypes.title')}>
        <p>{t('organization.classtypes.error_loading')}</p>
      </ContentCard>
    </OrganizationClasstypesBase>
  )
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

  
  const classtypes = data.organizationClasstypes
  // Empty list
  if (!classtypes.edges.length) { return (
    <OrganizationClasstypesBase>
      <ContentCard cardTitle={t('organization.classtypes.title')}
                  headerContent={headerOptions}>
        <p>
        {(!archived) ? t('organization.classtypes.empty_list') : t("organization.classtypes.empty_archive")}
        </p>
      </ContentCard>
    </OrganizationClasstypesBase>
  )}   

  return (
    <OrganizationClasstypesBase>
      <ContentCard cardTitle={t('organization.classtypes.title')}
                   headerContent={headerOptions}
                   hasCardBody={false}
                   pageInfo={classtypes.pageInfo}
                   onLoadMore={() => {
                    fetchMore({
                      variables: {
                        after: classtypes.pageInfo.endCursor
                      },
                      updateQuery: (previousResult, { fetchMoreResult }) => {
                        const newEdges = fetchMoreResult.organizationClasstypes.edges
                        const pageInfo = fetchMoreResult.organizationClasstypes.pageInfo

                        return newEdges.length
                          ? {
                              // Put the new locations at the end of the list and update `pageInfo`
                              // so we have the new `endCursor` and `hasNextPage` values
                              organizationClasstypes: {
                                __typename: previousResult.organizationClasstypes.__typename,
                                edges: [ ...previousResult.organizationClasstypes.edges, ...newEdges ],
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
              <Table.ColHeader>{t('')}</Table.ColHeader>
              <Table.ColHeader>{t('general.name')}</Table.ColHeader>
              <Table.ColHeader>{t('general.public')}</Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {classtypes.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    <Avatar size="lg" imageURL={node.urlImageThumbnailSmall} />
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.name}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {(node.displayPublic) ? 
                      <Badge color="success">{t('general.yes')}</Badge>: 
                      <Badge color="danger">{t('general.no')}</Badge>}
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    {(localStorage.getItem(CSLS.ORGANIZATION_CLASSTYPES_ARCHIVED) === "true") ? 
                      <span className='text-muted'>{t('general.unarchive_to_edit')}</span> :
                      <div>
                        <Button className='btn-sm' 
                                onClick={() => history.push("/organization/classtypes/edit/" + node.id)}
                                color="secondary">
                          {t('general.edit')}
                        </Button>
                        <Button className='btn-sm' 
                                onClick={() => history.push("/organization/classtypes/edit_image/" + node.id)}
                                color="secondary">
                          {t('organization.classtypes.edit_image')}
                        </Button>
                      </div>
                    }
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    <button className="icon btn btn-link btn-sm" 
                        title={t('general.archive')} 
                        onClick={() => {
                          console.log("clicked archived")
                          archiveClasstype({ variables: {
                            input: {
                              id: node.id,
                              archived: !node.archived
                            }
                    }, refetchQueries: [
                        {query: GET_CLASSTYPES_QUERY, variables: get_list_query_variables()}
                    ]}).then(({ data }) => {
                      console.log('got data', data);
                      toast.success(
                        (node.archived) ? t('general.unarchived'): t('general.archived'), {
                          position: toast.POSITION.BOTTOM_RIGHT
                        })
                    }).catch((error) => {
                      toast.error((t('general.toast_server_error')) +  error, {
                          position: toast.POSITION.BOTTOM_RIGHT
                        })
                      console.log('there was an error sending the query', error);
                    })
                    }}>
                      <Icon name="inbox" />
                    </button>
                  </Table.Col>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </OrganizationClasstypesBase>
  )
}

export default withTranslation()(withRouter(OrganizationClasstypes))