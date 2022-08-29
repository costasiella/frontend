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
  query ScheduleEventActivityInputValues($after: String, $before: String) {
    accounts(first: 100, before: $before, after: $after, isActive: true, instructor: true) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          fullName
        }
      }
    }
    organizationLocationRooms(first: 100, before: $before, after: $after, archived: false) {
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
          organizationLocation {
            id
            name
          }
        }
      }
    }
  }
`