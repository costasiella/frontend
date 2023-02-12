import { gql } from "@apollo/client"

export const GET_INVOICES_QUERY = gql`
  query FinanceInvoices($after: String, $before: String, $status: CostasiellaFinanceInvoiceStatusChoices, $business: ID!) {
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

export const GET_INPUT_VALUES_QUERY = gql`
  query InvoiceInputValues($after: String, $before: String, $business: ID!) {
    financeInvoiceGroups(first: 100, before: $before, after: $after, archived: false) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          name
        }
      }
    }
    business(id: $business) {
      id
      name
    }
  }
`

export const CREATE_B2B_INVOICE = gql`
  mutation CreateFinanceInvoice($input: CreateFinanceInvoiceInput!) {
    createFinanceInvoice(input: $input) {
      financeInvoice {
        id
      }
    }
  }
`