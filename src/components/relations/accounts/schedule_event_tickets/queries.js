import { gql } from "@apollo/client"

export const GET_ACCOUNT_SCHEDULE_EVENT_TICKETS_QUERY = gql`
  query AccountScheduleEventTickets($after: String, $before: String, $account: ID!) {
    accountScheduleEventTickets(first: 15, before: $before, after: $after, account: $account) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          cancelled
          infoMailSent
          scheduleEventTicket {
            id
            name
            scheduleEvent {
              id
              name
              dateStart
              organizationLocation {
                name
              }
            }
          }
          invoiceItems(first:1) {
            edges {
              node {
                financeInvoice {
                  id
                  invoiceNumber
                  status
                }
              }
            }
          }
        }
      }
    }
  }
`
