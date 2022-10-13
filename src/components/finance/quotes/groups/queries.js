import { gql } from "@apollo/client"

export const GET_QUOTE_GROUPS_QUERY = gql`
  query FinanceQuoteGroupsQuery($archived: Boolean!) {
    financeQuoteGroups(archived: $archived) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          archived
          displayPublic
          name
          nextId
          expiresAfterDays
          prefix
          prefixYear
          autoResetPrefixYear
          terms
          footer
          code
        }
      }
    }
  }
`

export const GET_QUOTE_GROUP_QUERY = gql`
  query FinanceQuoteGroup($id: ID!) {
    financeQuoteGroup(id:$id) {
      id
      archived
      displayPublic
      name
      nextId
      expiresAfterDays
      prefix
      prefixYear
      autoResetPrefixYear
      terms
      footer
      code
    }
  }
`

export const UPDATE_QUOTE_GROUP = gql`
mutation UpdateFinanceQuoteGroup($input: UpdateFinanceQuoteGroupInput!) {
  updateFinanceQuoteGroup(input: $input) {
    financeQuoteGroup {
      id
      name
      code
    }
  }
}
`

export const ADD_QUOTE_GROUP = gql`
mutation CreateFinanceQuoteGroup($input:CreateFinanceQuoteGroupInput!) {
  createFinanceQuoteGroup(input: $input) {
    financeQuoteGroup{
      id
    }
  }
}
`

export const ARCHIVE_QUOTE_GROUP = gql`
mutation ArchiveFinanceQuoteGroup($input: ArchiveFinanceQuoteGroupInput!) {
  archiveFinanceQuoteGroup(input: $input) {
    financeQuoteGroup {
      id
      archived
    }
  }
}
`