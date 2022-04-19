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

import BadgeBoolean from "../../ui/BadgeBoolean"
import ContentCard from "../../general/ContentCard"
import OrganizationClasspassesBase from './OrganizationClasspassesBase'

import { GET_CLASSPASSES_QUERY, ARCHIVE_CLASSPASS } from "./queries"


function OrganizationClasspasses({t, history}) {
  const cardTitle = t('organization.classpasses.title')
  let [archived, setArchived] = useState(false)

  const { loading, error, data, refetch, fetchMore } = useQuery(GET_CLASSPASSES_QUERY, {
    variables: { archived: archived },
    fetchPolicy: "network-only"
  })
  const [ archiveClasspass ] = useMutation(ARCHIVE_CLASSPASS)

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
    <OrganizationClasspassesBase>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationClasspassesBase>
  )

  if (error) return (
    <OrganizationClasspassesBase>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('organization.classpasses.error_loading')}</p>
      </ContentCard>
    </OrganizationClasspassesBase>
  )

  let classpasses = data.organizationClasspasses

  // Empty list
  if (!classpasses.edges.length) { return (
    <OrganizationClasspassesBase>
      <ContentCard cardTitle={cardTitle}
                    headerContent={headerOptions}>
        <p>
          {(!archived) ? t('organization.classpasses.empty_list') : t("organization.classpasses.empty_archive")}
        </p>
      </ContentCard>
    </OrganizationClasspassesBase>
  )}

  return (
    <OrganizationClasspassesBase>
      <ContentCard 
        cardTitle={cardTitle}
        headerContent={headerOptions}
        hasCardBody={false}
        pageInfo={classpasses.pageInfo}
        onLoadMore={() => {
        fetchMore({
          variables: {
            after: classpasses.pageInfo.endCursor
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            const newEdges = fetchMoreResult.organizationClasspasses.edges
            const pageInfo = fetchMoreResult.organizationClasspasses.pageInfo

            return newEdges.length
              ? {
                  // Put the new memberships at the end of the list and update `pageInfo`
                  // so we have the new `endCursor` and `hasNextPage` values
                  organizationClasspasses: {
                    __typename: previousResult.organizationClasspasses.__typename,
                    edges: [ ...previousResult.organizationClasspasses.edges, ...newEdges ],
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
              <Table.ColHeader>{t('general.name')}</Table.ColHeader>
              <Table.ColHeader>{t('general.public')}</Table.ColHeader>
              <Table.ColHeader>{t('general.shop')}</Table.ColHeader>
              <Table.ColHeader>{t('organization.classpasses.trial_pass')}</Table.ColHeader>
              <Table.ColHeader>{t('general.classes')}</Table.ColHeader>
              <Table.ColHeader>{t('general.price')}</Table.ColHeader>
              <Table.ColHeader>{t('general.validity')}</Table.ColHeader>
              <Table.ColHeader></Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {classpasses.edges.map(({ node }) => (
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
                    <BadgeBoolean value={node.trialPass} />
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {(node.unlimited) ? t('general.unlimited') : node.classes }
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.priceDisplay} <br />
                    {(node.financeTaxRate) ? 
                      <span className="text-muted">{node.financeTaxRate.name}</span>
                      : ""
                    }
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.validity} <br />
                    <span className="text-muted">
                      {node.validityUnitDisplay}
                    </span>
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    {(node.archived) ? 
                      <span className='text-muted'>{t('general.unarchive_to_edit')}</span> :
                      <Button className='btn-sm' 
                              onClick={() => history.push("/organization/classpasses/edit/" + node.id)}
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
                          archiveClasspass({ variables: {
                            input: {
                            id,
                            archived: !archived
                            }
                    }, refetchQueries: [
                        {query: GET_CLASSPASSES_QUERY, variables: {"archived": archived }}
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
    </OrganizationClasspassesBase>
  )
}

export default withTranslation()(withRouter(OrganizationClasspasses))