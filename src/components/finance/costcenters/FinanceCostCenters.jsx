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

import { GET_COSTCENTERS_QUERY, ARCHIVE_COSTCENTER } from "./queries"
import FinanceCostCentersBase from './FinanceCostCentersBase'


function FinanceCostCenters({t, history}) {
  let [archived, setArchived] = useState(false)
  const cardTitle = t('finance.costcenters.title')
  const { loading, error, data, refetch, fetchMore } = useQuery(GET_COSTCENTERS_QUERY, {
    variables: { archived: archived }
  })
  const [ archiveCostcenter ] = useMutation(ARCHIVE_COSTCENTER)

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
    <FinanceCostCentersBase>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </FinanceCostCentersBase>
  )

  if (error) return (
    <FinanceCostCentersBase>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('finance.costcenters.error_loading')}</p>
      </ContentCard>
    </FinanceCostCentersBase>
  )

  const costcenters = data.financeCostcenters

  // Empty list
  if (!costcenters.edges.length) { return (
    <FinanceCostCentersBase>
      <ContentCard cardTitle={cardTitle}
                    headerContent={headerOptions}>
        <p>
          {(!archived) ? t('finance.costcenters.empty_list') : t("finance.costcenters.empty_archive")}
        </p>
      </ContentCard>
    </FinanceCostCentersBase>
  )}

  return (
    <FinanceCostCentersBase>
      <ContentCard cardTitle={cardTitle}
                    headerContent={headerOptions}
                    pageInfo={costcenters.pageInfo}
                    onLoadMore={() => {
                    fetchMore({
                      variables: {
                        after: costcenters.pageInfo.endCursor
                      },
                      updateQuery: (previousResult, { fetchMoreResult }) => {
                        const newEdges = fetchMoreResult.financeCostcenters.edges
                        const pageInfo = fetchMoreResult.financeCostcenters.pageInfo

                        return newEdges.length
                          ? {
                              // Put the new costcenters at the end of the list and update `pageInfo`
                              // so we have the new `endCursor` and `hasNextPage` values
                              financeCostcenters: {
                                __typename: previousResult.financeCostcenters.__typename,
                                edges: [ ...previousResult.financeCostcenters.edges, ...newEdges ],
                                pageInfo
                              }
                            }
                          : previousResult
                      }
                    })
                  }} 
        >
        <Table>
          <Table.Header>
            <Table.Row key={v4()}>
              <Table.ColHeader>{t('general.name')}</Table.ColHeader>
              <Table.ColHeader>{t('finance.code')}</Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {costcenters.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    {node.name}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.code}
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    {(node.archived) ? 
                      <span className='text-muted'>{t('general.unarchive_to_edit')}</span> :
                      <Button className='btn-sm' 
                              onClick={() => history.push("/finance/costcenters/edit/" + node.id)}
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
                          archiveCostcenter({ variables: {
                            input: {
                            id,
                            archived: !archived
                            }
                    }, refetchQueries: [
                        {query: GET_COSTCENTERS_QUERY, variables: {"archived": archived }}
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
    </FinanceCostCentersBase>
  )
}


export default withTranslation()(withRouter(FinanceCostCenters))