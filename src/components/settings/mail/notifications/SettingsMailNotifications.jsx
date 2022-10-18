import React from 'react'
import { useQuery } from "@apollo/client"
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"
import {
  Button,
  Dimmer,
  Table
} from "tabler-react";

// import ButtonAdd from "../../../ui/ButtonAdd"
import ContentCard from "../../../general/ContentCard"

import { GET_NOTIFICATIONS_QUERY } from "./queries"
import SettingsMailNotificationsBase from './SettingsMailNotificationsBase'


function SettingsMailNotifications({ t, history }) {
  const cardTitle = t('settings.mail.notifications.title')
  const { loading, error, data, fetchMore } = useQuery(GET_NOTIFICATIONS_QUERY)
  // const [ archiveDiscovery ] = useMutation(ARCHIVE_DISCOVERY)

  if (loading) return (
    <SettingsMailNotificationsBase>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </SettingsMailNotificationsBase>
  )

  if (error) return (
    <SettingsMailNotificationsBase>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('settings.mail.notifications.error_loading')}</p>
      </ContentCard>
    </SettingsMailNotificationsBase>
  )

  const notifications = data.systemNotifications

  // Empty list
  if (!notifications.edges.length) { return (
    <SettingsMailNotificationsBase>
      <ContentCard cardTitle={cardTitle} >
        <p> 
          {t('settings.mail.notifications.empty_list')}
        </p>
      </ContentCard>
    </SettingsMailNotificationsBase>
  )}

  console.log(notifications)

  return (
    <SettingsMailNotificationsBase>
      <ContentCard cardTitle={cardTitle}
                    hasCardBody={false}
                    pageInfo={notifications.pageInfo}
                    onLoadMore={() => {
                    fetchMore({
                      variables: {
                        after: notifications.pageInfo.endCursor
                      },
                      updateQuery: (previousResult, { fetchMoreResult }) => {
                        const newEdges = fetchMoreResult.systemNotifications.edges
                        const pageInfo = fetchMoreResult.systemNotifications.pageInfo

                        return newEdges.length
                          ? {
                              // Put the new mailchimpLists at the end of the list and update `pageInfo`
                              // so we have the new `endCursor` and `hasNextPage` values
                              systemNotifications: {
                                __typename: previousResult.systemNotifications.__typename,
                                edges: [ ...previousResult.systemNotifications.edges, ...newEdges ],
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
              <Table.ColHeader className="text-right">{t('settings.mail.notifications.accounts')}</Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
              {notifications.edges.map(({ node }) => (
                <Table.Row key={v4()}>
                  <Table.Col key={v4()}>
                    {node.name}
                  </Table.Col>
                  <Table.Col>
                    <div className='float-right'>
                      {node.accounts.edges.map(({ node: accountNode }) => (
                        // TODO: Add a delete button to the right of each account
                        // console.log(accountNode)
                        <div>
                          {accountNode.fullName}<br />
                          <span className='text-muted'>{accountNode.email}</span>
                        </div>
                      ))}
                      <Link to={`/settings/mail/notifications/add_account/${node.id}`}>
                        <Button
                          color="link"
                          icon="plus-circle">
                            {t("settings.mail.notifications.add_account")}
                        </Button>
                      </Link>
                    </div>
                  </Table.Col>
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </SettingsMailNotificationsBase>
  ) 
}


export default withTranslation()(withRouter(SettingsMailNotifications))
