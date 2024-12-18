import { gql } from "@apollo/client"

export const GET_ACCOUNT_SCHEDULE_EVENT_TICKETS_QUERY = gql`
query AccountScheduleEventTickets($before:String, $after:String, $scheduleEventTicket:ID!) {
  accountScheduleEventTickets(first: 100, before: $before, after: $after, scheduleEventTicket:$scheduleEventTicket) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        id
        account {
          id
          fullName
        }
        cancelled
        paymentConfirmation
        infoMailSent
        invoiceItems {
          edges {
            node {
              financeInvoice {
                id
                invoiceNumber
                summary
              }
            }
          }
        }
      }
    }
  }
}
`


export const GET_ACCOUNTS_QUERY = gql`
  query AccountsAndTicketInfo(
    $after: String, 
    $before: String, 
    $searchName: String,
    $ticketId: ID!
  ) {
    accounts(
      first: 25, 
      before: $before, 
      after: $after, 
      isActive: true, 
      fullName_Icontains: $searchName,
      customer: true
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          fullName
          email
          isActive
        }
      }
    }
    scheduleEventTicket(id: $ticketId) {
      id
      displayPublic
      name
      description
      price
      scheduleEvent {
        name
        dateStart
      }
    }
    accountScheduleEventTickets(first: 1000, scheduleEventTicket: $ticketId) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          account {
            id
            fullName
          }
          cancelled
          paymentConfirmation
          infoMailSent
        }
      }
    }
  }
`

export const RESEND_INFO_MAIL_ACCOUNT_SCHEDULE_EVENT_TICKET = gql`
  mutation ResendTicketInfoMail($input: ResendInfoMailAccountScheduleEventTicketInput!) {
    resendInfoMailAccountScheduleEventTicket(input: $input) {
      ok
    }
  }
`

// export const GET_SCHEDULE_EVENT_TICKET_SCHEDULE_ITEM_QUERY = gql`
// query ScheduleEventTicket($before:String, $after:String, $id:ID!) {
//   scheduleEventTicket(id: $id) {
//     id
//     displayPublic
//     name
//     description
//     price
//     financeTaxRate {
//       id
//       name
//     }
//     financeGlaccount {
//       id
//       name
//     }
//     financeCostcenter {
//       id
//       name
//     }
//   }
//   financeTaxRates(first: 100, before: $before, after: $after, archived: false) {
//     pageInfo {
//       startCursor
//       endCursor
//       hasNextPage
//       hasPreviousPage
//     }
//     edges {
//       node {
//         id
//         name
//       }
//     }
//   }
//   financeGlaccounts(first: 100, before: $before, after: $after, archived: false) {
//     pageInfo {
//       startCursor
//       endCursor
//       hasNextPage
//       hasPreviousPage
//     }
//     edges {
//       node {
//         id
//         name
//       }
//     }
//   }
//   financeCostcenters(first: 100, before: $before, after: $after, archived: false) {
//     pageInfo {
//       startCursor
//       endCursor
//       hasNextPage
//       hasPreviousPage
//     }
//     edges {
//       node {
//         id
//         name
//       }
//     }
//   }
// }
// `


export const ADD_ACCOUNT_SCHEDULE_EVENT_TICKET = gql`
mutation CreateAccountScheduleEventTicket($input:CreateAccountScheduleEventTicketInput!) {
  createAccountScheduleEventTicket(input: $input) {
    accountScheduleEventTicket {
      id
    }
  }
}
`


export const UPDATE_ACCOUNT_SCHEDULE_EVENT_TICKET = gql`
  mutation UpdateAccountScheduleEventTicket($input:UpdateAccountScheduleEventTicketInput!) {
    updateAccountScheduleEventTicket(input: $input) {
      accountScheduleEventTicket {
        id
      }
    }
  }
`

// export const DELETE_SCHEDULE_EVENT_TICKET = gql`
//   mutation DeleteScheduleEventTicket($input: DeleteScheduleEventTicketInput!) {
//     deleteScheduleEventTicket(input: $input) {
//       ok
//     }
//   }
// `

