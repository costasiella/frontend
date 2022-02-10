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

import { GET_GLACCOUNTS_QUERY, ARCHIVE_GLACCOUNT } from "./queries"
import FinanceGLAccountsBase from './FinanceGLAccountsBase'


function FinanceGLAccounts({t, history}) {
  let [archived, setArchived] = useState(false)
  const cardTitle = t("finance.glaccounts.title")
  const { loading, error, data, refetch, fetchMore } = useQuery(GET_GLACCOUNTS_QUERY, {
    variables: { archived: archived }
  })
  const [ archiveGlaccount ] = useMutation(ARCHIVE_GLACCOUNT)

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
    <FinanceGLAccountsBase>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </FinanceGLAccountsBase>
  )

  if (error) return (
    <FinanceGLAccountsBase>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('finance.glaccounts.error_loading')}</p>
      </ContentCard>
    </FinanceGLAccountsBase>
  )

  const glaccounts = data.financeGlaccounts
   
  // Empty list
  if (!glaccounts.edges.length) { return (
    <FinanceGLAccountsBase>
      <ContentCard cardTitle={cardTitle}
                   headerContent={headerOptions}>
        <p>
          {(!archived) ? t('finance.glaccounts.empty_list') : t("finance.glaccounts.empty_archive")}
        </p>
      </ContentCard>
    </FinanceGLAccountsBase>
  )} 

  return (
    <FinanceGLAccountsBase>
      <ContentCard cardTitle={cardTitle}
                headerContent={headerOptions}
                pageInfo={glaccounts.pageInfo}
                hasCardBody={false}
                onLoadMore={() => {
                fetchMore({
                  variables: {
                    after: glaccounts.pageInfo.endCursor
                  },
                  updateQuery: (previousResult, { fetchMoreResult }) => {
                    const newEdges = fetchMoreResult.financeGlaccounts.edges
                    const pageInfo = fetchMoreResult.financeGlaccounts.pageInfo

                    return newEdges.length
                      ? {
                          // Put the new glaccounts at the end of the list and update `pageInfo`
                          // so we have the new `endCursor` and `hasNextPage` values
                          financeGlaccounts: {
                            __typename: previousResult.financeGlaccounts.__typename,
                            edges: [ ...previousResult.financeGlaccounts.edges, ...newEdges ],
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
              {glaccounts.edges.map(({ node }) => (
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
                              onClick={() => history.push("/finance/glaccounts/edit/" + node.id)}
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
                          archiveGlaccount({ variables: {
                            input: {
                            id,
                            archived: !archived
                            }
                    }, refetchQueries: [
                        {query: GET_GLACCOUNTS_QUERY, variables: {"archived": archived }}
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
    </FinanceGLAccountsBase>
  )
}

export default withTranslation()(withRouter(FinanceGLAccounts))