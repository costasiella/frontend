import { gql } from "@apollo/client"

export const GET_INVOICES_QUERY = gql`
  query FinanceInvoices($after: String, $before: String, $status: String, $business: ID!) {
    financeInvoices(first: 15, before: $before, after: $after, status: $status, business: $business) {
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
          business {
            id
            name
          }
          invoiceNumber
          status
          summary
          relationCompany
          relationContactName
          dateSent
          dateDue
          total
          totalDisplay
          balance
          balanceDisplay
        }
      }
    }
    business(id: $business) {
      id
      name
    }
  }
`
