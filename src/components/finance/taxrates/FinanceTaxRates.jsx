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
import FinanceTaxRatesBase from './FinanceTaxRatesBase'

import { GET_TAXRATES_QUERY, ARCHIVE_TAXRATE } from "./queries"

function FinanceTaxRates({t, history}) {
  let [archived, setArchived] = useState(false)
  const cardTitle = t('finance.taxrate.title')
  const { loading, error, data, refetch, fetchMore } = useQuery(GET_TAXRATES_QUERY, {
    variables: { archived: archived }
  })
  const [ archiveTaxrate ] = useMutation(ARCHIVE_TAXRATE)

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
    <FinanceTaxRatesBase>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </FinanceTaxRatesBase>
  )

  if (error) return (
    <FinanceTaxRatesBase>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('finance.glaccounts.error_loading')}</p>
      </ContentCard>
    </FinanceTaxRatesBase>
  )

  const taxrates = data.financeTaxRates

  // Empty list
  if (!taxrates.edges.length) { return (
    <FinanceTaxRatesBase>
      <ContentCard cardTitle={cardTitle}
                    headerContent={headerOptions}>
        <p>
          {(!archived) ? t('finance.taxrates.empty_list') : t("finance.taxrates.empty_archive")}
        </p>
      </ContentCard>
    </FinanceTaxRatesBase>
  )}

  return (
    <FinanceTaxRatesBase>
      <ContentCard cardTitle={cardTitle}
                    headerContent={headerOptions}
                    pageInfo={taxrates.pageInfo}
                    onLoadMore={() => {
                    fetchMore({
                      variables: {
                        after: taxrates.pageInfo.endCursor
                      },
                      updateQuery: (previousResult, { fetchMoreResult }) => {
                        const newEdges = fetchMoreResult.financeTaxRates.edges
                        const pageInfo = fetchMoreResult.financeTaxRates.pageInfo

                        return newEdges.length
                          ? {
                              // Put the new taxrates at the end of the list and update `pageInfo`
                              // so we have the new `endCursor` and `hasNextPage` values
                              financeTaxRates: {
                                __typename: previousResult.financeTaxRates.__typename,
                                edges: [ ...previousResult.financeTaxRates.edges, ...newEdges ],
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
              <Table.ColHeader>{t('finance.taxrates.percentage')}</Table.ColHeader>
              <Table.ColHeader>{t('finance.taxrates.rateType')}</Table.ColHeader>
              <Table.ColHeader>{t('finance.code')}</Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {taxrates.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    {node.name}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.percentage} %
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.rateType}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.code}
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    {(node.archived) ? 
                      <span className='text-muted'>{t('general.unarchive_to_edit')}</span> :
                      <Button className='btn-sm' 
                              onClick={() => history.push("/finance/taxrates/edit/" + node.id)}
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
                          archiveTaxrate({ variables: {
                            input: {
                            id,
                            archived: !archived
                            }
                    }, refetchQueries: [
                        {query: GET_TAXRATES_QUERY, variables: {"archived": archived }}
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
    </FinanceTaxRatesBase>
  )
}

export default withTranslation()(withRouter(FinanceTaxRates))