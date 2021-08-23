import { gql } from "@apollo/client"

export const GET_PAYMENT_METHODS_QUERY = gql`
  query FinancePaymentMethods($after: String, $before: String, $archived: Boolean) {
    financePaymentMethods(first: 15, before: $before, after: $after, archived: $archived) {
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
          systemMethod
          name
          code
        }
      }
    }
  }
`

export const GET_PAYMENT_METHOD_QUERY = gql`
  query FinancePaymentMethod($id: ID!) {
    financePaymentMethod(id:$id) {
      id
      name
      code
      archived
    }
  }
`

export const ADD_PAYMENT_METHOD = gql`
mutation CreateFinancePaymentMethod($input:CreateFinancePaymentMethodInput!) {
  createFinancePaymentMethod(input: $input) {
    financePaymentMethod{
      id
      archived
      name
      code
    }
  }
}
`

export const UPDATE_PAYMENT_METHOD = gql`
mutation UpdateFinancePaymentMethod($input: UpdateFinancePaymentMethodInput!) {
  updateFinancePaymentMethod(input: $input) {
    financePaymentMethod {
      id
      name
      code
    }
  }
}
`

export const ARCHIVE_PAYMENT_METHOD = gql`
mutation ArchiveFinancePaymentMethod($input: ArchiveFinancePaymentMethodInput!) {
  archiveFinancePaymentMethod(input: $input) {
    financePaymentMethod {
      id
      archived
    }
  }
}
`