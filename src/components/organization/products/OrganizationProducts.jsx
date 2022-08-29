import React, { useState } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { toast } from 'react-toastify'
import {
  Avatar,
  Icon,
  Dimmer,
  Badge,
  Button,
  Card,
  Table
} from "tabler-react";


import ContentCard from "../../general/ContentCard"
import ButtonEdit from "../../ui/ButtonEdit"
import { get_list_query_variables } from './tools'
import { GET_ORGANIZATION_PRODUCTS_QUERY, ARCHIVE_ORGANIZATION_PRODUCT } from "./queries"
import OrganizationProductsBase from "./OrganizationProductsBase"


function OrganizationProducts({t, history}) {
  const cardTitle = t('organization.products.title')
  let [archived, setArchived] = useState(false)
  const {loading, error, data, refetch, fetchMore} = useQuery(GET_ORGANIZATION_PRODUCTS_QUERY, { 
    variables: {archived: archived}
  })
  const [archiveProduct] = useMutation(ARCHIVE_ORGANIZATION_PRODUCT)

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
                        <ButtonEdit editUrl={`/organization/product/edit/${node.id}`} />
                    }
                    {/* <button className="icon btn btn-link btn-sm" 
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
                    </button> */}
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