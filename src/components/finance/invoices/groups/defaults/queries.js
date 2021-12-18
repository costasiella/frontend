import { gql } from "@apollo/client"

export const GET_INVOICE_GROUPS_DEFAULTS_QUERY = gql`
query FinanceInvoiceGroupDefaults($archived: Boolean!) {
  financeInvoiceGroupDefaults(first: 100) {
    edges {
      node {
        id
        itemType
        financeInvoiceGroup {
          id
          name
        }
      }
    }
  }
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

export const UPDATE_INVOICE_GROUP_DEFAULT = gql`
  mutation UpdateFinanceInvoiceGroupDefault($input: UpdateFinanceInvoiceGroupDefaultInput!) {
    updateFinanceInvoiceGroupDefault(input: $input) {
      financeInvoiceGroupDefault {
        id
        itemType
        financeInvoiceGroup {
          id
          name
        }
      }
    }
  }
`
