import { gql } from "@apollo/client"

export const GET_SUBSCRIPTIONS_QUERY = gql`
  query OrganizationSubscriptions($after: String, $before: String, $archived: Boolean) {
    organizationSubscriptions(first: 15, before: $before, after: $after, archived: $archived) {
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
          priceTodayDisplay
          displayPublic
          displayShop
          name
          description
          sortOrder
          minDuration
          classes
          subscriptionUnit
          subscriptionUnitDisplay
          reconciliationClasses
          creditAccumulationDays
          unlimited
          termsAndConditions
          registrationFee
          quickStatsAmount
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
    }
  }
`

export const GET_SUBSCRIPTION_QUERY = gql`
  query OrganizationSubscription($id: ID!, $after: String, $before: String) {
    organizationSubscription(id:$id) {
      id
      archived
      displayPublic
      displayShop
      name
      description
      sortOrder
      minDuration
      classes
      subscriptionUnit
      subscriptionUnitDisplay
      reconciliationClasses
      creditAccumulationDays
      unlimited
      termsAndConditions
      registrationFee
      quickStatsAmount
      financeGlaccount {
        id 
        name
      }
      financeCostcenter {
        id
        name
      }
    }
    financeGlaccounts(first: 15, before: $before, after: $after, archived: false) {
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
    financeCostcenters(first: 15, before: $before, after: $after, archived: false) {
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

export const GET_INPUT_VALUES_QUERY = gql`
  query SubscriptionInputValues($after: String, $before: String) {
    financeGlaccounts(first: 15, before: $before, after: $after, archived: false) {
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
    financeCostcenters(first: 15, before: $before, after: $after, archived: false) {
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


export const CREATE_SUBSCRIPTION = gql`
  mutation CreateSubscription($input: CreateOrganizationSubscriptionInput!) {
    createOrganizationSubscription(input: $input) {
      organizationSubscription {
        id
      }
    }
  }
`


export const UPDATE_SUBSCRIPTION = gql`
  mutation UpdateOrganizationSubscription($input: UpdateOrganizationSubscriptionInput!) {
    updateOrganizationSubscription(input: $input) {
      organizationSubscription {
        id
      }
    }
  }
`


export const ARCHIVE_SUBSCRIPTION = gql`
mutation ArchiveOrganizationSubscription($input: ArchiveOrganizationSubscriptionInput!) {
  archiveOrganizationSubscription(input: $input) {
    organizationSubscription {
      id
      archived
    }
  }
}
`