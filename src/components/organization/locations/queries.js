import { gql } from "@apollo/client"

export const GET_LOCATIONS_QUERY = gql`
  query OrganizationLocations($after: String, $before: String, $archived: Boolean) {
    organizationLocations(first: 100, before: $before, after: $after, archived: $archived) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id,
          archived,
          displayPublic,
          name
        }
      }
    }
  }
`

export const GET_LOCATION_QUERY = gql`
  query OrganizationLocation($id: ID!) {
    organizationLocation(id:$id) {
      id
      name
      displayPublic
      archived
    }
  }
`

export const ADD_LOCATION = gql`
mutation CreateOrganizationLocation($input: CreateOrganizationLocationInput!) {
  createOrganizationLocation(input: $input) {
    organizationLocation {
      id
      archived
      displayPublic
      name
    }
  }
}
`

export const UPDATE_LOCATION = gql`
mutation UpdateOrganizationLocation($input: UpdateOrganizationLocationInput!) {
  updateOrganizationLocation(input: $input) {
    organizationLocation {
      id
      name
      displayPublic
    }
  }
}
`

export const ARCHIVE_LOCATION = gql`
mutation ArchiveOrganizationLocation($input: ArchiveOrganizationLocationInput!) {
  archiveOrganizationLocation(input: $input) {
    organizationLocation {
      id
      archived
    }
  }
}
`
