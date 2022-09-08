import React, { useState } from 'react'
import { useQuery } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import {
  Avatar,
  Dimmer,
  Button,
  Card,
  Table
} from "tabler-react";


import ContentCard from "../../general/ContentCard"
import ButtonEdit from "../../ui/ButtonEdit"
import { GET_ORGANIZATION_PRODUCTS_QUERY  } from "./queries"
import OrganizationProductArchive from './OrganizationProductArchive'
import OrganizationProductsBase from "./OrganizationProductsBase"


function OrganizationProducts({t, history}) {
  const cardTitle = t('organization.products.title')
  let [archived, setArchived] = useState(false)
  const {loading, error, data, refetch, fetchMore} = useQuery(GET_ORGANIZATION_PRODUCTS_QUERY, { 
    variables: {archived: archived}
  })

  if (loading) return (
    <OrganizationProductsBase>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationProductsBase>
  )
  // Error
  if (error) return (
    <OrganizationProductsBase>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('organization.products.error_loading')}</p>
      </ContentCard>
    </OrganizationProductsBase>
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

  
  const products = data.organizationProducts
  // Empty list
  if (!products.edges.length) { return (
    <OrganizationProductsBase>
      <ContentCard cardTitle={cardTitle}
                  headerContent={headerOptions}>
        <p>
          {(!archived) ? t('organization.products.empty_list') : t("organization.products.empty_archive")}
        </p>
      </ContentCard>
    </OrganizationProductsBase>
  )}   

  return (
    <OrganizationProductsBase>
      <ContentCard cardTitle={cardTitle}
                   headerContent={headerOptions}
                   hasCardBody={false}
                   pageInfo={products.pageInfo}
                   onLoadMore={() => {
                    fetchMore({
                      variables: {
                        after: products.pageInfo.endCursor
                      },
                      updateQuery: (previousResult, { fetchMoreResult }) => {
                        const newEdges = fetchMoreResult.organizationProducts.edges
                        const pageInfo = fetchMoreResult.organizationProducts.pageInfo

                        return newEdges.length
                          ? {
                              // Put the new locations at the end of the list and update `pageInfo`
                              // so we have the new `endCursor` and `hasNextPage` values
                              organizationProducts: {
                                __typename: previousResult.organizationProducts.__typename,
                                edges: [ ...previousResult.organizationProducts.edges, ...newEdges ],
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
              <Table.ColHeader></Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {products.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    <Avatar size="lg" imageURL={node.urlImageThumbnailSmall} />
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.name}
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    {(node.archived) ? 
                      <span className='text-muted'>{t('general.unarchive_to_edit')}</span> :
                        <ButtonEdit editUrl={`/organization/products/edit/${node.id}`} />
                    }
                    <OrganizationProductArchive node={node} />
                  </Table.Col>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </OrganizationProductsBase>
  )
}

export default withTranslation()(withRouter(OrganizationProducts))