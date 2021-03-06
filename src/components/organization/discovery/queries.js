import { gql } from "@apollo/client"

export const GET_DISCOVERIES_QUERY = gql`
  query OrganizationDiscoveries($after: String, $before: String, $archived: Boolean) {
    organizationDiscoveries(first: 15, before: $before, after: $after, archived: $archived) {
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

export const GET_DISCOVERY_QUERY = gql`
  query SchoolDiscovery($id: ID!) {
    organizationDiscovery(id:$id) {
      id
      name
      archived
    }
  }
`

export const ADD_DISCOVERY = gql`
  mutation CreateOrganizationDiscovery($input:CreateOrganizationDiscoveryInput!) {
    createOrganizationDiscovery(input: $input) {
      organizationDiscovery{
        id
        archived
        name
      }
    }
  }
`

export const UPDATE_DISCOVERY = gql`
mutation UpdateOrganizationDiscovery($input: UpdateOrganizationDiscoveryInput!) {
  updateOrganizationDiscovery(input: $input) {
    organizationDiscovery {
      id
      name
    }
  }
}
`

export const ARCHIVE_DISCOVERY = gql`
mutation ArchiveOrganizationDiscovery($input: ArchiveOrganizationDiscoveryInput!) {
  archiveOrganizationDiscovery(input: $input) {
    organizationDiscovery {
      id
      archived
    }
  }
}
`
