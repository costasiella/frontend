import { gql } from "@apollo/client"

export const GET_INVOICE_GROUPS_QUERY = gql`
  query FinanceInvoiceGroupsQuery($archived: Boolean!) {
    financeInvoiceGroups(archived: $archived) {
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
          dueAfterDays
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

export const GET_INVOICE_GROUP_QUERY = gql`
  query FinanceInvoiceGroup($id: ID!) {
    financeInvoiceGroup(id:$id) {
      id
      archived
      displayPublic
      name
      nextId
      dueAfterDays
      prefix
      prefixYear
      autoResetPrefixYear
      terms
      footer
      code
    }
  }
`

export const UPDATE_INVOICE_GROUP = gql`
mutation UpdateFinanceInvoiceGroup($input: UpdateFinanceInvoiceGroupInput!) {
  updateFinanceInvoiceGroup(input: $input) {
    financeInvoiceGroup {
      id
      name
      code
    }
  }
}
`

export const ADD_INVOICE_GROUP = gql`
mutation CreateFinanceInvoiceGroup($input:CreateFinanceInvoiceGroupInput!) {
  createFinanceInvoiceGroup(input: $input) {
    financeInvoiceGroup{
      id
      archived
      displayPublic
      name
      nextId
      dueAfterDays
      prefix
      prefixYear
      autoResetPrefixYear
      terms
      footer
      code
    }
  }
}
`

export const ARCHIVE_INVOICE_GROUP = gql`
mutation ArchiveFinanceInvoiceGroup($input: ArchiveFinanceInvoiceGroupInput!) {
  archiveFinanceInvoiceGroup(input: $input) {
    financeInvoiceGroup {
      id
      archived
    }
  }
}
`