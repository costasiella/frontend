import { gql } from "@apollo/client"

export const GET_LEVELS_QUERY = gql`
  query OrganizationLevels($after: String, $before: String, $archived: Boolean) {
    organizationLevels(first: 15, before: $before, after: $after, archived: $archived) {
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
        }
      }
    }
  }
`

export const GET_LEVEL_QUERY = gql`
  query SchoolLevel($id: ID!) {
    organizationLevel(id:$id) {
      id
      name
      archived
    }
  }
`

export const ADD_LEVEL = gql`
mutation CreateOrganizationLevel($input:CreateOrganizationLevelInput!) {
  createOrganizationLevel(input: $input) {
    organizationLevel{
      id
      archived
      name
    }
  }
}
`

export const UPDATE_LEVEL = gql`
mutation UpdateOrganizationLevel($input: UpdateOrganizationLevelInput!) {
  updateOrganizationLevel(input: $input) {
    organizationLevel {
      id
      name
    }
  }
}
`

export const ARCHIVE_LEVEL = gql`
mutation ArchiveOrganizationLevel($input: ArchiveOrganizationLevelInput!) {
  archiveOrganizationLevel(input: $input) {
    organizationLevel {
      id
      archived
    }
  }
}
`