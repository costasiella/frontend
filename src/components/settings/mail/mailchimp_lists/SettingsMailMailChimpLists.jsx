import React from 'react'
import { useQuery } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Dimmer,
  Table
} from "tabler-react";

import ButtonEdit from "../../../ui/ButtonEdit"
import ContentCard from "../../../general/ContentCard"

import { GET_MAILCHIMP_LISTS_QUERY } from "./queries"
import SettingsMailMailChimpListsBase from './SettingsMailMailChimpListsBase'
import SettingsMailMailChimpListDelete from './SettingsMailMailChimpListDelete'


function SettingsMailMailChimpLists({ t, history }) {
  const cardTitle = t('settings.mail.mailchimp_lists.title')
  const { loading, error, data, refetch, fetchMore } = useQuery(GET_MAILCHIMP_LISTS_QUERY)
  // const [ archiveDiscovery ] = useMutation(ARCHIVE_DISCOVERY)

  if (loading) return (
    <SettingsMailMailChimpListsBase>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </SettingsMailMailChimpListsBase>
  )

  if (error) return (
    <SettingsMailMailChimpListsBase>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('settings.mail.mailchimp_lists.error_loading')}</p>
      </ContentCard>
    </SettingsMailMailChimpListsBase>
  )

  const mailchimpLists = data.systemMailchimpLists

  // Empty list
  if (!mailchimpLists.edges.length) { return (
    <SettingsMailMailChimpListsBase>
      <ContentCard cardTitle={cardTitle} >
        <p> 
          {t('settings.mail.mailchimp_lists.empty_list')}
        </p>
      </ContentCard>
    </SettingsMailMailChimpListsBase>
  )}

  return (
    <SettingsMailMailChimpListsBase>
      <ContentCard cardTitle={cardTitle}
                    hasCardBody={false}
                    pageInfo={mailchimpLists.pageInfo}
                    onLoadMore={() => {
                    fetchMore({
                      variables: {
                        after: mailchimpLists.pageInfo.endCursor
                      },
                      updateQuery: (previousResult, { fetchMoreResult }) => {
                        const newEdges = fetchMoreResult.organizationmailchimpLists.edges
                        const pageInfo = fetchMoreResult.organizationmailchimpLists.pageInfo

                        return newEdges.length
                          ? {
                              // Put the new mailchimpLists at the end of the list and update `pageInfo`
                              // so we have the new `endCursor` and `hasNextPage` values
                              organizationmailchimpLists: {
                                __typename: previousResult.organizationmailchimpLists.__typename,
                                edges: [ ...previousResult.organizationmailchimpLists.edges, ...newEdges ],
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
              <Table.ColHeader>{t('settings.mail.mailchimp_lists.mailchimp_list_id')}</Table.ColHeader>
              <Table.ColHeader></Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {mailchimpLists.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    {node.name}
                  </Table.Col>
                  <Table.Col key={v4()}>
                    {node.mailchimpListId}
                  </Table.Col>
                  <Table.Col className="text-right" key={v4()}>
                    <ButtonEdit editUrl={`/settings/mail/mailchimp_lists/edit/${node.id}`} />
                    <SettingsMailMailChimpListDelete node={node} />
                  </Table.Col>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </SettingsMailMailChimpListsBase>
  ) 
}


export default withTranslation()(withRouter(SettingsMailMailChimpLists))