import React from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { toast } from 'react-toastify'
import { v4 } from 'uuid'
import { Link } from 'react-router-dom'

import {
  Badge,
  Button,
  Card,
  Table,
} from "tabler-react";

import { GET_ACCOUNT_SCHEDULE_EVENT_TICKETS_QUERY, UPDATE_ACCOUNT_SCHEDULE_EVENT_TICKET } from "./queries"
import CSLS from '../../../../../tools/cs_local_storage'
import BadgeBoolean from "../../../../ui/BadgeBoolean"
import ScheduleEventTicketEditBase from "../ScheduleEventTicketEditBase"
import ButtonAdd from '../../../../ui/ButtonAdd'



function ScheduleEventTicketEditCustomers({ t, history, match }) {
  const id = match.params.id
  const eventId = match.params.event_id
  const returnUrl = `/schedule/events/edit/${eventId}/tickets/`
  const activeTab = "customers"
  const activeLink = 'tickets'

  const { loading, error, data } = useQuery(GET_ACCOUNT_SCHEDULE_EVENT_TICKETS_QUERY, {
    variables: {
      scheduleEventTicket: id
    }
  })

  const [updateAccountScheduleEventTicket] = useMutation(UPDATE_ACCOUNT_SCHEDULE_EVENT_TICKET)
  // const [updateScheduleEventTicketScheduleItem] = useMutation(UPDATE_SCHEDULE_EVENT_TICKET_SCHEDULE_ITEM)

  // set returnURL for invoice links
  localStorage.setItem(CSLS.FINANCE_INVOICES_EDIT_RETURN, 
    `/schedule/events/edit/${eventId}/tickets/edit/${id}/customers`)

  if (loading) return (
    <ScheduleEventTicketEditBase 
      activeTab={activeTab} 
      activeLink={activeLink} 
      returnUrl={returnUrl}
    >
      {t("general.loading_with_dots")}
    </ScheduleEventTicketEditBase>
  )
  if (error) return (
    <ScheduleEventTicketEditBase 
      activeTab={activeTab} 
      activeLink={activeLink} 
      returnUrl={returnUrl}
    >
      <p>{t('general.error_sad_smiley')}</p>
      <p>{error.message}</p>
    </ScheduleEventTicketEditBase>
  )

  console.log(data)

  const pageHeaderOptions = <React.Fragment>
    <ButtonAdd addUrl={`/schedule/events/edit/${eventId}/tickets/edit/${id}/customers/search`}
      className="ml-2" />
  </React.Fragment>


  // Data
  return (
    <ScheduleEventTicketEditBase 
      activeTab={activeTab} 
      activeLink={activeLink} 
      returnUrl={returnUrl}
      pageHeaderOptions={pageHeaderOptions}
    >
      <Table cards>
        <Table.Header>
          <Table.Row>
            <Table.ColHeader>{t('general.name')}</Table.ColHeader>
            <Table.ColHeader>{t('general.invoice')}</Table.ColHeader>
            <Table.ColHeader>{t('schedule.events.tickets.info_mail_sent')}</Table.ColHeader> 
            <Table.ColHeader></Table.ColHeader> 
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.accountScheduleEventTickets.edges.map(({ node }) => (
            <Table.Row key={v4()}>
              <Table.Col>
                {node.account.fullName} <br />
                {(node.cancelled) ? <Badge color="warning">{t("general.cancelled")}</Badge> : ""}
              </Table.Col>  
              <Table.Col>
                { node.invoiceItems.edges && <Link to={`/finance/invoices/edit/${node.invoiceItems.edges[0].node.financeInvoice.id}`}>
                    {node.invoiceItems.edges[0].node.financeInvoice.invoiceNumber } <br />
                  </Link>
                }
                <small className="text-muted">
                  {node.invoiceItems.edges && node.invoiceItems.edges[0].node.financeInvoice.summary.trunc(40) } <br />
                </small>
              </Table.Col>
              <Table.Col>
                <BadgeBoolean value={node.infoMailSent} /> <br />
                {/* TODO: resend link here */}
              </Table.Col>
              <Table.Col>
                {(node.cancelled) ?
                  <Button 
                    className="pull-right"
                    color="warning"
                    onClick={() =>
                      updateAccountScheduleEventTicket({ variables: {
                        input: {
                          id: node.id,
                          cancelled: false
                        }
                      }, refetchQueries: [
                          {query: GET_ACCOUNT_SCHEDULE_EVENT_TICKETS_QUERY, variables: {
                            scheduleEventTicket: id
                          }},
                      ]})
                      .then(({ data }) => {
                          console.log('got data', data);
                          toast.success((t('schedule.events.tickets.customers.uncancelled')), {
                              position: toast.POSITION.BOTTOM_RIGHT
                            })
                        }).catch((error) => {
                          toast.error((t('general.toast_server_error')) +  error, {
                              position: toast.POSITION.BOTTOM_RIGHT
                            })
                          console.log('there was an error sending the query', error)
                        }
                      )
                    }
                  >
                    {t("general.uncancel")}
                  </Button>
                :
                  <Button 
                    className="pull-right"
                    color="warning"
                    onClick={() =>
                      updateAccountScheduleEventTicket({ variables: {
                        input: {
                          id: node.id,
                          cancelled: true
                        }
                      }, refetchQueries: [
                          {query: GET_ACCOUNT_SCHEDULE_EVENT_TICKETS_QUERY, variables: {
                            scheduleEventTicket: id
                          }},
                      ]})
                      .then(({ data }) => {
                          console.log('got data', data);
                          toast.success((t('schedule.events.tickets.customers.cancelled')), {
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
                      {t("general.cancel")}
                    </Button>
                }
              </Table.Col>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </ScheduleEventTicketEditBase>
  )
}


export default withTranslation()(withRouter(ScheduleEventTicketEditCustomers))