import { gql } from "@apollo/client"

export const GET_DOCUMENTS_QUERY = gql`
  query AccountDocuments($account: ID!) {
    accountDocuments(account:$account) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          description
          urlProtectedDocument
          createdAt
        }
      }
    }
    account(id:$account) {
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

export const GET_DOCUMENT_QUERY = gql`
  query AccountDocument($id: ID!, $account: ID!) {
    accountDocument(id:$id) {
      id
      description
    }
    account(id:$account) {
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

export const ADD_DOCUMENT = gql`
  mutation CreateAccountDocument($input:CreateAccountDocumentInput!) {
    createAccountDocument(input: $input) {
      accountDocument{
        id
      }
    }
  }
`

export const UPDATE_DOCUMENT = gql`
  mutation UpdateAccountDocument($input:UpdateAccountDocumentInput!) {
    updateAccountDocument(input: $input) {
      accountDocument{
        id
      }
    }
  }
`

export const DELETE_DOCUMENT = gql`
  mutation DeleteAccountDocument($input:DeleteAccountDocumentInput!) {
    deleteAccountDocument(input: $input) {
      ok
    }
  }
`
