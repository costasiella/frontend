import { gql } from "@apollo/client"


export const GET_ORGANIZATION_PRODUCTS_QUERY = gql`
  query OrganizationProducts($before:String, $after:String, $archived: Boolean) {
    organizationProducts(first: 100, before:$before, after:$after, archived: $archived) {
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
          name
          description
          priceDisplay
          urlImage
          urlImageThumbnailSmall
        }
      }
    }
  }
`


export const GET_ORGANIZATION_PRODUCT_QUERY = gql`
  query OrganizationProduct($id:ID!) {
    organizationProduct(id: $id) {
      id
      name
      description
      price
      financeTaxRate {
        id
        name
      }
      financeGlaccount {
        id 
        name
      }
      financeCostcenter {
        id
        name
      }
    }
  }
`

export const ADD_ORGANIZATION_PRODUCT = gql`
mutation CreateOrganizationProduct($input:CreateOrganizationProductInput!) {
  createOrganizationProduct(input: $input) {
    organizationProduct {
      id
    }
  }
}
`


export const ARCHIVE_ORGANIZATION_PRODUCT   = gql`
  mutation ArchiveOrganizationProduct($input: ArchiveOrganizationProductInput!) {
    archiveOrganizationProduct(input: $input) {
      organizationProduct {
        id
        archived
      }
    }
  }
`


export const GET_INPUT_VALUES_QUERY = gql`
  query InputValues($after: String, $before: String) {
    financeTaxRates(first: 100, before: $before, after: $after, archived: false) {
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
        }
      }
    }
    financeGlaccounts(first: 100, before: $before, after: $after, archived: false) {
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
          code
        }
      }
    }
    financeCostcenters(first: 100, before: $before, after: $after, archived: false) {
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
          code
        }
      }
    }
  }
`
