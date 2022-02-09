import { gql } from "@apollo/client"

export const GET_SUBSCRIPTION_PRICES_QUERY = gql`
  query OrganizationSubscriptionPrices($after: String, $before: String, $organizationSubscription: ID!) {
    organizationSubscriptionPrices(first: 15, before: $before, after: $after, organizationSubscription: $organizationSubscription) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          organizationSubscription {
            id
            name
          }
          price
          priceDisplay
          financeTaxRate {
            id
            name
          }
          dateStart
          dateEnd
        }
      }
    }
    organizationSubscription(id: $organizationSubscription) {
      id
      name
    }
  }
`

export const GET_SUBSCRIPTION_PRICE_QUERY = gql`
  query OrganizationSubscriptionPrice($id: ID!, $after: String, $before: String) {
    organizationSubscriptionPrice(id:$id) {
      id
      organizationSubscription {
        id
        name
      }
      price
      priceDisplay
      financeTaxRate {
        id
        name
      }
      dateStart
      dateEnd
    }
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
  }
`

export const ADD_SUBSCRIPTION_PRICE = gql`
mutation CreateOrganizationSubscriptionPrice($input: CreateOrganizationSubscriptionPriceInput!) {
  createOrganizationSubscriptionPrice(input: $input) {
    organizationSubscriptionPrice {
      id
      organizationSubscription {
        id
        name
      }
      price
      financeTaxRate {
        id
        name
      }
      dateStart
      dateEnd
    }
  }
}
`

export const UPDATE_SUBSCRIPTION_PRICE = gql`
mutation UpdateOrganizationSubscriptionPrice($input: UpdateOrganizationSubscriptionPriceInput!) {
  updateOrganizationSubscriptionPrice(input: $input) {
    organizationSubscriptionPrice {
      id
      organizationSubscription {
        id
        name
      }
      price
      financeTaxRate {
        id
        name
      }
      dateStart
      dateEnd
    }
  }
}
`

export const DELETE_SUBSCRIPTION_PRICE = gql`
  mutation DeleteOrganizationSubscriptionPrice($input: DeleteOrganizationSubscriptionPriceInput!) {
    deleteOrganizationSubscriptionPrice(input: $input) {
      ok
    }
  }
`