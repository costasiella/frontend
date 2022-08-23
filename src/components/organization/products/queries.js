import { gql } from "@apollo/client"


export const GET_ORGANIZATION_PRODUCTS_QUERY = gql`
  query OrganizationProducts($before:String, $after:String, $scheduleEvent:ID!) {
    organizationProducts(first: 100, before:$before, after:$after, scheduleEvent:$scheduleEvent) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
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


export const DELETE_SCHEDULE_EVENT_MEDIA   = gql`
  mutation DeleteScheduleEventMedia($input: DeleteScheduleEventMediaInput!) {
    deleteScheduleEventMedia(input: $input) {
      ok
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