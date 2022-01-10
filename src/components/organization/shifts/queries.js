import { gql } from "@apollo/client"

export const GET_SHIFTS_QUERY = gql`
  query OrganizationShifts($after: String, $before: String, $archived: Boolean) {
    organizationShifts(first: 15, before: $before, after: $after, archived: $archived) {
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

export const GET_SHIFT_QUERY = gql`
  query SchoolShift($id: ID!) {
    organizationShift(id:$id) {
      id
      name
      archived
    }
  }
`

export const ADD_SHIFT = gql`
mutation CreateOrganizationShift($input:CreateOrganizationShiftInput!) {
  createOrganizationShift(input: $input) {
    organizationShift{
      id
      archived
      name
    }
  }
}
`

export const UPDATE_SHIFT = gql`
mutation UpdateOrganizationShift($input: UpdateOrganizationShiftInput!) {
  updateOrganizationShift(input: $input) {
    organizationShift {
      id
      name
    }
  }
}
`

export const ARCHIVE_SHIFT = gql`
mutation ArchiveOrganizationShift($input: ArchiveOrganizationShiftInput!) {
  archiveOrganizationShift(input: $input) {
    organizationShift {
      id
      archived
    }
  }
}
`