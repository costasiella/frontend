import { gql } from "@apollo/client"

export const GET_CLASSPASS_GROUPS_QUERY = gql`
  query OrganizationClasspassGroups($after: String, $before: String) {
    organizationClasspassGroups(first: 15, before: $before, after: $after) {
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


export const GET_CLASSPASS_GROUP_QUERY = gql`
  query OrganizationClasspassGroup($id: ID!) {
    organizationClasspassGroup(id:$id) {
      id
      name
      description
    }
  }
`


export const GET_CLASSPASS_GROUP_PASSES_QUERY = gql`
  query GetPassesAndGroupMembership($after: String, $before: String, $id:ID!) {
    organizationClasspasses(first: 15, before: $before, after: $after) {
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
    organizationClasspassGroup(id: $id) {
      id
      name
      description
      organizationClasspasses {
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

export const ADD_CLASSPASS_GROUP = gql`
mutation CreateOrganizationClasspassGroup($input:CreateOrganizationClasspassGroupInput!) {
  createOrganizationClasspassGroup(input: $input) {
    organizationClasspassGroup{
      id
    }
  }
}
`

export const UPDATE_CLASSPASS_GROUP = gql`
mutation UpdateOrganizationClasspassGroup($input: UpdateOrganizationClasspassGroupInput!) {
  updateOrganizationClasspassGroup(input: $input) {
    organizationClasspassGroup {
      id
      name
    }
  }
}
`

export const DELETE_CLASSPASS_GROUP = gql`
  mutation DeleteClasspassGroup($input: DeleteOrganizationClasspassGroupInput!) {
    deleteOrganizationClasspassGroup(input: $input) {
      ok
    }
  }
`

export const ADD_CARD_TO_GROUP = gql`
  mutation AddCardToGroup($input: CreateOrganizationClasspassGroupClasspassInput!) {
    createOrganizationClasspassGroupClasspass(input:$input) {
      organizationClasspassGroupClasspass {
        id
        organizationClasspass {
          id
          name
        }
        organizationClasspassGroup {
          id
          name
        }
      }
    }
  }
`

export const DELETE_CARD_FROM_GROUP = gql`
  mutation DeleteCardFromGroup($input: DeleteOrganizationClasspassGroupClasspassInput!) {
    deleteOrganizationClasspassGroupClasspass(input:$input) {
      ok
    }
  }
`