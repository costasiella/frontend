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
import OrganizationLanguagesBase from './OrganizationLanguagesBase'

import { GET_LANGUAGES_QUERY, ARCHIVE_LANGUAGE } from "./queries"


function OrganizationLanguages({t, history}) {
  let [archived, setArchived] = useState(false)
  const cardTitle = t('organization.languages.title')
  const { loading, error, data, refetch, fetchMore } = useQuery(GET_LANGUAGES_QUERY, {
    variables: { archived: archived }
  })
  const [ archiveLanguage ] = useMutation(ARCHIVE_LANGUAGE)

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
    <OrganizationLanguagesBase>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationLanguagesBase>
  )

  if (error) return (
    <OrganizationLanguagesBase>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('organization.subscriptions.error_loading')}</p>
      </ContentCard>
    </OrganizationLanguagesBase>
  )

  let languages = data.organizationLanguages

  // Empty list
  if (!languages.edges.length) { return (
    <OrganizationLanguagesBase>
      <ContentCard cardTitle={t('organization.languages.title')}
                    headerContent={headerOptions}>
        <p>
          {(!archived) ? t('organization.languages.empty_list') : t("organization.languages.empty_archive")}
        </p>
      </ContentCard>
    </OrganizationLanguagesBase>
  )}


  return (
    <OrganizationLanguagesBase>
      <ContentCard 
        cardTitle={cardTitle}
        headerContent={headerOptions}
        pageInfo={languages.pageInfo}
        onLoadMore={() => {
        fetchMore({
          variables: {
            after: languages.pageInfo.endCursor
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.organizationLanguages.edges
            const pageInfo = fetchMoreResult.organizationLanguages.pageInfo

            return newEdges.length
              ? {
                  // Put the new languages at the end of the list and update `pageInfo`
                  // so we have the new `endCursor` and `hasNextPage` values
                  organizationLanguages: {
                    __typename: previousResult.organizationLanguages.__typename,
                    edges: [ ...previousResult.organizationLanguages.edges, ...newEdges ],
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
              {languages.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    {node.name}
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    {(node.archived) ? 
                      <span className='text-muted'>{t('general.unarchive_to_edit')}</span> :
                      <Button className='btn-sm' 
                              onClick={() => history.push("/organization/languages/edit/" + node.id)}
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
                          archiveLanguage({ variables: {
                            input: {
                            id,
                            archived: !archived
                            }
                    }, refetchQueries: [
                        {query: GET_LANGUAGES_QUERY, variables: {"archived": archived }}
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
                      <Icon prefix="fe" name="inbox" />
                    </button>
                  </Table.Col>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </OrganizationLanguagesBase>
  )
}

export default withTranslation()(withRouter(OrganizationLanguages))