import { gql } from "@apollo/client"

export const GET_SUBSCRIPTION_GROUPS_QUERY = gql`
  query OrganizationSubscriptionGroups($after: String, $before: String) {
    organizationSubscriptionGroups(first: 100, before: $before, after: $after) {
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
          description
        }
      }
    }
  }
`


export const GET_SUBSCRIPTION_GROUP_QUERY = gql`
  query OrganizationSubscriptionGroup($id: ID!) {
    organizationSubscriptionGroup(id:$id) {
      id
      name
      description
    }
  }
`


export const GET_SUBSCRIPTION_GROUP_SUBSCRIPTIONS_QUERY = gql`
  query GetPassesAndGroupMembership($after: String, $before: String, $id:ID!) {
    organizationSubscriptions(first: 100, before: $before, after: $after, archived: false) {
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
        }
      }
    }
    organizationSubscriptionGroup(id: $id) {
      id
      name
      description
      organizationSubscriptions {
        edges {
          node {
            id
            name
          }
        }
      }
    }
  }
`

export const ADD_SUBSCRIPTION_GROUP = gql`
  mutation CreateOrganizationSubscriptionGroup($input:CreateOrganizationSubscriptionGroupInput!) {
    createOrganizationSubscriptionGroup(input: $input) {
      organizationSubscriptionGroup{
        id
      }
    }
  }
`

export const UPDATE_SUBSCRIPTION_GROUP = gql`
mutation UpdateOrganizationSubscriptionGroup($input: UpdateOrganizationSubscriptionGroupInput!) {
  updateOrganizationSubscriptionGroup(input: $input) {
    organizationSubscriptionGroup {
      id
    }
  }
}
`

export const DELETE_SUBSCRIPTION_GROUP = gql`
  mutation DeleteSubscriptionGroup($input: DeleteOrganizationSubscriptionGroupInput!) {
    deleteOrganizationSubscriptionGroup(input: $input) {
      ok
    }
  }
`

export const ADD_CARD_TO_GROUP = gql`
  mutation AddCardToGroup($input: CreateOrganizationSubscriptionGroupSubscriptionInput!) {
    createOrganizationSubscriptionGroupSubscription(input:$input) {
      organizationSubscriptionGroupSubscription {
        id
        organizationSubscription {
          id
          name
        }
        organizationSubscriptionGroup {
          id
          name
        }
      }
    }
  }
`


export const DELETE_CARD_FROM_GROUP = gql`
  mutation DeleteCardFromGroup($input: DeleteOrganizationSubscriptionGroupSubscriptionInput!) {
    deleteOrganizationSubscriptionGroupSubscription(input:$input) {
      ok
    }
  }
`