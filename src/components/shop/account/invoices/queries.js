import { gql } from "@apollo/client"


export const QUERY_ACCOUNT_INVOICES = gql`
  query FinanceInvoices($after: String, $before: String, $account: ID!) {
    financeInvoices(first: 15, before: $before, after: $after, account: $account) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
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
    user {
      id
      accountId
      firstName
      lastName
      fullName
      email
      gender
      dateOfBirth
      address
      postcode
      city
      country
      phone
      mobile
      emergency
    }
  }
`

export const CREATE_PAYMENT_LINK = gql`
mutation CreateFinanceInvoicePaymentLink($id: ID!) {
  createFinanceInvoicePaymentLink(id: $id) {
    financeInvoicePaymentLink {
      paymentLink
    }
  }
}
`
