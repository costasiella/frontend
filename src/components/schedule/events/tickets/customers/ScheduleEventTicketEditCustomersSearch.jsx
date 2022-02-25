import React, { useState, useContext } from 'react'
import { useQuery } from '@apollo/client'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import moment from 'moment'

import {
  Icon,
  Button,
  Card,
  Dimmer,
  Table
} from "tabler-react";
import { getAccountsQueryVariables } from "./tools"

import AppSettingsContext from '../../../../context/AppSettingsContext'
import ScheduleEventEditBaseBase from '../../edit/ScheduleEventEditBaseBase'
import ContentCard from "../../../../general/ContentCard"
import InputSearch from "../../../../general/InputSearch"
import { GET_ACCOUNTS_QUERY } from "./queries"


function ScheduleEventTicketEditCustomersSearch({ t, match, history }) {
  let [searchName, setSearchName] = useState("")
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  
  const ticketId = match.params.id
  const eventId = match.params.event_id
  const returnUrl = `/schedule/events/edit/${eventId}/tickets/edit/${ticketId}/customers`
  const activeLink = 'tickets'
  const cardTitle = t('schedule.events.tickets.customers.search')

  
  const { loading, error, data, refetch, fetchMore } = useQuery(
    GET_ACCOUNTS_QUERY, {
      variables: getAccountsQueryVariables(ticketId)
    }
  )

  const headerOptions = <Card.Options>
    <InputSearch 
      initialValueKey={searchName}
      placeholder="Search..."
      onChange={(value) => {
        console.log(value)
        if (value) {
          // {console.log('showSearch')}
          // {console.log(showSearch)}
          setSearchName(value)
          refetch({ variables: getAccountsQueryVariables(ticketId)})
        } 
      }}
    />
  </Card.Options>

  // Loading
  if (loading) return (
    <ScheduleEventEditBaseBase 
      activeLink={activeLink} 
      cardTitle={cardTitle} 
      returnUrl={returnUrl}
    >
      <Card.Body>
        <Dimmer active={true} loader={true} />
      </Card.Body>
    </ScheduleEventEditBaseBase>
  )
  // Error
  if (error) return (
    <ScheduleEventEditBaseBase 
      activeLink={activeLink} 
      cardTitle={cardTitle} 
      returnUrl={returnUrl}
    >
      <Card.Body>
        <p>{t('schedule.events.tickets.customers.search.error_loading')}</p>
      </Card.Body>
    </ScheduleEventEditBaseBase>
  )  

  console.log(data)
  const accounts = data.accounts
  const ticket = data.scheduleEventTicket
  const event = ticket.scheduleEvent
  const dateStart = moment(event.dateStart).format(dateFormat)
  // TODO: Add date to page subtitle
  const pageSubTitle = `${ticket.scheduleEvent.name} ${dateStart} - ${ticket.name}`

  // Empty list
  if (!accounts.edges.length) return (
    <ScheduleEventEditBaseBase 
      activeLink={activeLink} 
      pageSubTitle={pageSubTitle}
      returnUrl={returnUrl}
    >
      <ContentCard cardTitle={cardTitle}
                   hasCardBody={false}
                   headerContent={headerOptions}
      >
        <Card.Body>
          <p>{t('schedule.events.tickets.customers.search.empty_list')}</p>
        </Card.Body>
      </ContentCard>
    </ScheduleEventEditBaseBase>
  )

  
  return (
    <ScheduleEventEditBaseBase 
      activeLink={activeLink} 
      cardTitle={cardTitle} 
      pageSubTitle={pageSubTitle}
      returnUrl={returnUrl}
    >
      <ContentCard cardTitle={cardTitle}
                   pageInfo={accounts.pageInfo}
                   hasCardBody={false}
                   headerContent={headerOptions}
                   onLoadMore={() => {
                      fetchMore({
                      variables: {
                        after: accounts.pageInfo.endCursor
                      },
                      updateQuery: (previousResult, { fetchMoreResult }) => {
                        const newEdges = fetchMoreResult.accounts.edges
                        const pageInfo = fetchMoreResult.accounts.pageInfo 

                        return newEdges.length
                          ? {
                              // Put the new scheduleItemEnrollments at the end of the list and update `pageInfo`
                              // so we have the new `endCursor` and `hasNextPage` values
                              data: {
                                accounts: {
                                  __typename: previousResult.accounts.__typename,
                                  edges: [ ...previousResult.accounts.edges, ...newEdges ],
                                  pageInfo
                                }
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
              <Table.ColHeader>{t('general.email')}</Table.ColHeader>
              <Table.ColHeader></Table.ColHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {accounts.edges.map(({ node }) => (
              <Table.Row key={v4()}>
                <Table.Col key={v4()}>
                  {node.fullName}
                </Table.Col>
                <Table.Col key={v4()}>
                  {node.email}
                </Table.Col>
                <Table.Col className="text-right" key={v4()}>
                  Sell >
                  {/* <Link to={`/schedule/classes/all/enrollments/${scheduleItemId}/options/${node.id}`}>
                    <Button color="secondary">
                      {t("general.enroll")} <Icon name="chevron-right" />
                    </Button>
                  </Link> */}
                </Table.Col>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </ContentCard>
    </ScheduleEventEditBaseBase>
  )
}


export default withTranslation()(withRouter(ScheduleEventTicketEditCustomersSearch))
