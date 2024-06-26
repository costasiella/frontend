import React, { useState } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"

import {
  Icon,
  Dimmer,
  Button,
  Card,
  Table
} from "tabler-react";
import { toast } from 'react-toastify'

import ContentCard from "../../general/ContentCard"
import FinancePaymentMethodsBase from './FinancePaymentMethodsBase'

import { GET_PAYMENT_METHODS_QUERY, ARCHIVE_PAYMENT_METHOD } from "./queries"


function FinancePaymentMethods({ t, history }) {
  let [archived, setArchived] = useState(false)
  const cardTitle = t('finance.payment_methods.title')
  const { loading, error, data, refetch, fetchMore } = useQuery(GET_PAYMENT_METHODS_QUERY, {
    variables: { archived: archived }
  })

  const [ archivePaymentMethod ] = useMutation(ARCHIVE_PAYMENT_METHOD)

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
    <FinancePaymentMethodsBase>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </FinancePaymentMethodsBase>
  )

  if (error) return (
    <FinancePaymentMethodsBase>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('finance.payment_methods.error_loading')}</p>
      </ContentCard>
    </FinancePaymentMethodsBase>
  )

  const paymentMethods = data.financePaymentMethods

  // Empty list
  if (!paymentMethods.edges.length) { return (
    <FinancePaymentMethodsBase>
      <ContentCard cardTitle={cardTitle}
                    headerContent={headerOptions}>
        <p>
          {(!archived) ? t('finance.payment_methods.empty_list') : t("finance.payment_methods.empty_archive")}
        </p>
      </ContentCard>
    </FinancePaymentMethodsBase>
  )}

  return (
    <FinancePaymentMethodsBase>
      <ContentCard cardTitle={cardTitle}
                    headerContent={headerOptions}
                    pageInfo={paymentMethods.pageInfo}
                    hasCardBody={false}
                    onLoadMore={() => {
                    fetchMore({
                      variables: {
                        after: paymentMethods.pageInfo.endCursor
                      },
                      updateQuery: (previousResult, { fetchMoreResult }) => {
                        const newEdges = fetchMoreResult.financePaymentMethods.edges
                        const pageInfo = fetchMoreResult.financePaymentMethods.pageInfo

                        return newEdges.length
                          ? {
                              // Put the new paymentMethods at the end of the list and update `pageInfo`
                              // so we have the new `endCursor` and `hasNextPage` values
                              financePaymentMethods: {
                                __typename: previousResult.financePaymentMethods.__typename,
                                edges: [ ...previousResult.financePaymentMethods.edges, ...newEdges ],
                                pageInfo
                              }
                            }
                          : previousResult
                      }
                    })
                  }} >
        <Table cards>
          <Table.Header>
            <Table.Row key={v4()}>
              <Table.ColHeader>{t('general.name')}</Table.ColHeader>
              <Table.ColHeader>{t('finance.code')}</Table.ColHeader>
              <Table.ColHeader></Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {paymentMethods.edges.map(({ node }) => (
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
                      <Link to={`/finance/paymentmethods/edit/${node.id}`}>
                        <Button className='btn-sm' 
                                color="secondary">
                          {t('general.edit')}
                        </Button>
                      </Link>
                    }
                    {(node.systemMethod) ? "" :
                      <button className="icon btn btn-link btn-sm" 
                        title={t('general.archive')} 
                        href=""
                        onClick={() => {
                          console.log("clicked archived")
                          let id = node.id
                          archivePaymentMethod({ variables: {
                            input: {
                              id,
                              archived: !archived
                            }
                      }, refetchQueries: [
                          {query: GET_PAYMENT_METHODS_QUERY, variables: {"archived": archived }}
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
                    }
                  </Table.Col>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </ContentCard>      
    </FinancePaymentMethodsBase>
  )
}


export default withTranslation()(withRouter(FinancePaymentMethods))