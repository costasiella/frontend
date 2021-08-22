import { gql } from "@apollo/client"

export const GET_TAXRATES_QUERY = gql`
  query FinanceTaxRates($after: String, $before: String, $archived: Boolean) {
    financeTaxRates(first: 15, before: $before, after: $after, archived: $archived) {
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
          percentage
          rateType
          code
        }
      }
    }
  }
`

export const GET_TAXRATE_QUERY = gql`
  query FinanceTaxRate($id: ID!) {
    financeTaxRate(id:$id) {
      id
      archived
      name
      percentage
      rateType
      code
    }
  }
`

export const ADD_TAXRATE = gql`
mutation CreateFinanceTaxRate($input:CreateFinanceTaxRateInput!) {
  createFinanceTaxRate(input: $input) {
    financeTaxRate{
      id
      archived
      name
      percentage
      rateType
      code
    }
  }
}
`

export const UPDATE_TAXRATE = gql`
mutation UpdateFinanceTaxRate($input: UpdateFinanceTaxRateInput!) {
  updateFinanceTaxRate(input: $input) {
    financeTaxRate {
      id
      archived
      name
      percentage
      rateType
      code
    }
  }
}
`

export const ARCHIVE_TAXRATE = gql`
mutation ArchiveFinanceTaxRate($input: ArchiveFinanceTaxRateInput!) {
  archiveFinanceTaxRate(input: $input) {
    financeTaxRate {
      id
      archived
    }
  }
}
`
