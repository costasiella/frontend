import { gql } from "@apollo/client"

export const GET_GLACCOUNTS_QUERY = gql`
  query FinanceGLAccounts($after: String, $before: String, $archived: Boolean) {
    financeGlaccounts(first: 15, before: $before, after: $after, archived: $archived) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id,
          archived,
          name,
          code
        }
      }
    }
  }
`

export const GET_GLACCOUNT_QUERY = gql`
  query FinanceGLAccount($id: ID!) {
    financeGlaccount(id:$id) {
      id
      name
      code
      archived
    }
  }
`

export const ADD_GLACCOUNT = gql`
mutation CreateFinanceGLAccount($input:CreateFinanceGLAccountInput!) {
  createFinanceGlaccount(input: $input) {
    financeGlaccount{
      id
      archived
      name
      code
    }
  }
}
`

export const UPDATE_GLACCOUNT = gql`
mutation UpdateFinanceGLAccount($input: UpdateFinanceGLAccountInput!) {
  updateFinanceGlaccount(input: $input) {
    financeGlaccount {
      id
      name
      code
    }
  }
}
`

export const ARCHIVE_GLACCOUNT = gql`
mutation ArchiveFinanceGLAccount($input: ArchiveFinanceGLAccountInput!) {
  archiveFinanceGlaccount(input: $input) {
    financeGlaccount {
      id
      archived
    }
  }
}
`