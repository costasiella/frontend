import React, { useState, useContext } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { toast } from 'react-toastify'
import moment from 'moment'

import {
  Alert,
  Badge,
  Icon,
  Button,
  Card,
  Dimmer,
  Table
} from "tabler-react";
import { getAccountsQueryVariables } from "./tools"

import CSLS from "../../../../../tools/cs_local_storage"
import AppSettingsContext from '../../../../context/AppSettingsContext'
import ScheduleEventEditBaseBase from '../../edit/ScheduleEventEditBaseBase'
import ContentCard from "../../../../general/ContentCard"
import InputSearch from "../../../../general/InputSearch"
import { GET_ACCOUNTS_QUERY, ADD_ACCOUNT_SCHEDULE_EVENT_TICKET, GET_ACCOUNT_SCHEDULE_EVENT_TICKETS_QUERY } from "./queries"


function ScheduleEventTicketEditCustomersSearch({ t, match, history }) {
  let [searchName, setSearchName] = useState("")
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  
  const ticketId = match.params.id
  const eventId = match.params.event_id
  const returnUrl = `/schedule/events/edit/${eventId}/tickets/edit/${ticketId}/customers`
  const activeLink = 'tickets'
  const cardTitle = t('schedule.events.tickets.customers.search.title')

  const { loading, error, data, refetch, fetchMore } = useQuery(
    GET_ACCOUNTS_QUERY, {
      variables: getAccountsQueryVariables(ticketId, searchName)
    }
  )
  const [ addAccountScheduleEventTicket ] = useMutation(ADD_ACCOUNT_SCHEDULE_EVENT_TICKET)

  const headerOptions = <Card.Options>
    <InputSearch 
      initialValueKey={CSLS.SCHEDULE_EVENTS_TICKETS_CUSTOMERS_SEARCH}
      placeholder="Search..."
      onChange={(value) => {
        console.log(value)
        localStorage.setItem(CSLS.SCHEDULE_EVENTS_TICKETS_CUSTOMERS_SEARCH, value)
        setSearchName(value)
        console.log("Executing refetch")
        refetch({ variables: getAccountsQueryVariables(ticketId, value)})
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
  const accountScheduleEventTickets = data.accountScheduleEventTickets
  const dateStart = moment(event.dateStart).format(dateFormat)
  // TODO: Add date to page subtitle
  const pageSubTitle = `${ticket.scheduleEvent.name} ${dateStart} - ${ticket.name}`
  let accountIdsWithTickets = []
  accountScheduleEventTickets.edges.map(({ node }) => (
    accountIdsWithTickets.push(node.account.id)
  ))
  console.log(accountIdsWithTickets)

  // No search name entered
  if (!searchName) return (
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
          <Alert type="primary" icon="info">
            {t('schedule.events.tickets.customers.search.search_to_find_customers_to_sell_to')}
          </Alert> 
        </Card.Body>
      </ContentCard>
    </ScheduleEventEditBaseBase>
  )

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
          <Alert type="secondary">{t('schedule.events.tickets.customers.search.empty_list')}</Alert>
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
                  {(accountIdsWithTickets.includes(node.id)) ? 
                    <Badge color="success" className="pull-right">{t("schedule.events.tickets.customers.search_results_already_bought")}</Badge> :
                    <Button a
                      color="primary"
                      outline
                      onClick={() =>
                        addAccountScheduleEventTicket({ variables: {
                          input: {
                            account: node.id,
                            scheduleEventTicket: ticketId
                          }                            
                        }, refetchQueries: [
                            {query: GET_ACCOUNT_SCHEDULE_EVENT_TICKETS_QUERY, variables: {
                              scheduleEventTicket: ticketId
                            }},
                        ]})
                        .then(({ data }) => {
                            console.log('got data', data);
                            history.push(returnUrl)
                            toast.success((`${t('schedule.events.tickets.customers.toast_add_success')} ${node.fullName}`), {
                                position: toast.POSITION.BOTTOM_RIGHT
                              })
                          }).catch((error) => {
                            toast.error((t('general.toast_server_error')) +  error, {
                                position: toast.POSITION.BOTTOM_RIGHT
                              })
                            console.log('there was an error sending the query', error)
                          })
                      }
                    >
                      {t("general.sell")} <Icon name="chevron-right" />
                    </Button>
                  }
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
