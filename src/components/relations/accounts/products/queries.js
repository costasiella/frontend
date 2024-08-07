import { gql } from "@apollo/client"

export const GET_ACCOUNT_PRODUCTS_QUERY = gql`
  query AccountProducts($after: String, $before: String, $accountId: ID!) {
    accountProducts(first: 15, before: $before, after: $after, account: $accountId) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          organizationProduct {
            id
            name
            description
            urlImageThumbnailSmall
          }
          quantity
          createdAt
          invoiceItems {
            edges {
              node {
                financeInvoice {
                  invoiceNumber
                  id
                }
              }
            }
          }
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
    }
  }
`

// export const GET_ACCOUNT_PRODUCT_QUERY = gql`
//   query AccountProduct($id: ID!, $accountId: ID!, $after: String, $before: String) {
//     accountProduct(id:$id) {
//       id
//       organizationProduct {
//         id
//         name
//       }
//       quantity
//       createdAt
//     }
//     organizationClasspasses(first: 100, before: $before, after: $after, archived: false) {
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
//     account(id:$accountId) {
//       id
//       firstName
//       lastName
//       email
//       phone
//       mobile
//       isActive
//       urlImageThumbnailSmall
//     }
//   }
// `

export const GET_INPUT_VALUES_QUERY = gql`
  query ProductInputValues($after: String, $before: String, $accountId: ID!) {
    organizationProducts(first: 100, before: $before, after: $after, archived: false) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          archived
          name
          description
          priceDisplay
          urlImageThumbnailLarge
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
    }
  }
`

export const CREATE_ACCOUNT_PRODUCT = gql`
  mutation CreateAccountProduct($input: CreateAccountProductInput!) {
    createAccountProduct(input: $input) {
      accountProduct {
        id
      }
    }
  }
`

export const DELETE_ACCOUNT_PRODUCT = gql`
  mutation DeleteAccountProduct($input: DeleteAccountProductInput!) {
    deleteAccountProduct(input: $input) {
      ok
    }
  }
`
