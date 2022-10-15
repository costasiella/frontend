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
  Table,
  Text
} from "tabler-react";

import { toast } from 'react-toastify'

import BadgeBoolean from "../../../ui/BadgeBoolean"
import ContentCard from "../../../general/ContentCard"

import { GET_QUOTE_GROUPS_QUERY, ARCHIVE_QUOTE_GROUP } from "./queries"
import FinanceQuoteGroupsBase from './FinanceQuoteGroupsBase'


function FinanceQuoteGroups({t, history}) {
  let [archived, setArchived] = useState(false)
  const cardTitle = t('finance.quote_groups.title')
  const { loading, error, data, refetch, fetchMore } = useQuery(GET_QUOTE_GROUPS_QUERY, {
    variables: { archived: archived }
  })
  const [ archiveQuoteGroup ] = useMutation(ARCHIVE_QUOTE_GROUP)

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
    <FinanceQuoteGroupsBase>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </FinanceQuoteGroupsBase>
  )

  if (error) return (
    <FinanceQuoteGroupsBase>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('finance.quote_groups.error_loading')}</p>
      </ContentCard>
    </FinanceQuoteGroupsBase>
  )

  const quoteGroups = data.financeQuoteGroups

  return (
    <FinanceQuoteGroupsBase>
      <ContentCard cardTitle={t('finance.quote_groups.title')}
                   headerContent={headerOptions}
                   pageInfo={quoteGroups.pageInfo}
                   hasCardBody={false}
                   onLoadMore={() => {
                   fetchMore({
                     variables: {
                       after: quoteGroups.pageInfo.endCursor
                      },
                      updateQuery: (previousResult, { fetchMoreResult }) => {
                        const newEdges = fetchMoreResult.financeQuoteGroups.edges
                        const pageInfo = fetchMoreResult.financeQuoteGroups.pageInfo

                        return newEdges.length
                          ? {
                              // Put the new quoteGroups at the end of the list and update `pageInfo`
                              // so we have the new `endCursor` and `hasNextPage` values
                              financeQuoteGroups: {
                                __typename: previousResult.financeQuoteGroups.__typename,
                                edges: [ ...previousResult.financeQuoteGroups.edges, ...newEdges ],
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
              <Table.ColHeader>{t('finance.quote_groups.next_id')}</Table.ColHeader>
              <Table.ColHeader>{t('finance.quote_groups.expires_after_days')}</Table.ColHeader>
              <Table.ColHeader>{t('general.prefix')}</Table.ColHeader>
              <Table.ColHeader>{t('general.public')}</Table.ColHeader>
              <Table.ColHeader>{t('finance.code')}</Table.ColHeader>
              <Table.ColHeader />
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {quoteGroups.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    {node.name}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.nextId}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.expiresAfterDays}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.prefix} 
                    {(node.prefixYear) ? <span>[{t('general.year')}]<br /></span>: ''}
                    {(node.autoResetPrefixYear) ? <Text.Small color="gray">
                      {t('finance.quote_groups.auto_reset_prefix_year')}
                    </Text.Small>: ''}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    <BadgeBoolean value={node.displayPublic} />
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.code}
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    {(node.archived) ? 
                      <span className='text-muted'>{t('general.unarchive_to_edit')}</span> :
                      <Button className='btn-sm' 
                              onClick={() => history.push("/finance/quotes/groups/edit/" + node.id)}
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
                          archiveQuoteGroup({ variables: {
                            input: {
                            id,
                            archived: !archived
                            }
                    }, refetchQueries: [
                        {query: GET_QUOTE_GROUPS_QUERY, variables: {"archived": archived }}
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
                      <Icon name="inbox" />
                    </button>
                  </Table.Col>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </FinanceQuoteGroupsBase>
  )
}

export default withTranslation()(withRouter(FinanceQuoteGroups))