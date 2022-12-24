import { gql } from "@apollo/client"

export const GET_ACCOUNT_QUOTES_QUERY = gql`
  query FinanceQuotes($after: String, $before: String, $status: CostasiellaFinanceQuoteStatusChoices, $accountId: ID!) {
    financeQuotes(first: 15, before: $before, after: $after, status: $status, account: $accountId) {
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
          quoteNumber
          status
          summary
          relationCompany
          relationContactName
          dateSent
          dateExpire
          total
          totalDisplay
        }
      }
    }
    account(id:$accountId) {
      id
      firstName
      lastName
      fullName
      email
      phone
      mobile
      isActive
      urlImageThumbnailSmall
    }
  }
`

// export const GET_ACCOUNT_SUBSCRIPTION_QUERY = gql`
//   query AccountSubscription($id: ID!, $accountId: ID!, $after: String, $before: String) {
//     accountSubscription(id:$id) {
//       id
//       organizationSubscription {
//         id
//         name
//       }
//       financePaymentMethod {
//         id
//         name
//       }
//       dateStart
//       dateEnd
//       note
//       registrationFeePaid
//       createdAt
//     }
//     organizationSubscriptions(first: 100, before: $before, after: $after, archived: false) {
//       pageInfo {
//         startCursor
//         endCursor
//         hasNextPage
//         hasPreviousPage
//       }
//       edges {
//         node {
//           id
//           archived
//           name
//         }
//       }
//     }
//     financePaymentMethods(first: 100, before: $before, after: $after, archived: false) {
//       pageInfo {
//         startCursor
//         endCursor
//         hasNextPage
//         hasPreviousPage
//       }
//       edges {
//         node {
//           id
//           archived
//           name
//           code
//         }
//       }
//     }
//     account(id:$accountId) {
//       id
//       firstName
//       lastName
//       email
//       phone
//       mobile
//       isActive
//     }
//   }
// `

export const GET_INPUT_VALUES_QUERY = gql`
  query InvoiceInputValues($after: String, $before: String, $accountId: ID!) {
    financeQuoteGroups(first: 100, before: $before, after: $after, archived: false) {
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
    businesses(first: 100) {
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
    account(id:$accountId) {
      id
      firstName
      lastName
      email
      phone
      mobile
      isActive
      urlImageThumbnailSmall
      invoiceToBusiness {
        id
        name
      }
    }
  }
`

export const CREATE_ACCOUNT_QUOTE = gql`
  mutation CreateFinanceQuote($input: CreateFinanceQuoteInput!) {
    createFinanceQuote(input: $input) {
      financeQuote {
        id
      }
    }
  }
`