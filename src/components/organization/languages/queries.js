import { gql } from "@apollo/client"

export const GET_LANGUAGES_QUERY = gql`
  query OrganizationLanguages($after: String, $before: String, $archived: Boolean) {
    organizationLanguags(first: 15, before: $before, after: $after, archived: $archived) {
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

export const GET_LANGUAGE_QUERY = gql`
  query OrganizationLanguage($id: ID!) {
    organizationLanguage(id:$id) {
      id
      name
      archived
    }
  }
`

export const ADD_LANGUAGE = gql`
mutation CreateOrganizationLanguage($input:CreateOrganizationLanguageInput!) {
  createOrganizationLanguage(input: $input) {
    organizationLanguage{
      id
      archived
      name
    }
  }
}
`

export const UPDATE_LANGUAGE = gql`
mutation UpdateOrganizationLanguage($input: UpdateOrganizationLanguageInput!) {
  updateOrganizationLanguage(input: $input) {
    organizationLanguage {
      id
      name
    }
  }
}
`

export const ARCHIVE_LANGUAGE = gql`
mutation ArchiveOrganizationLanguage($input: ArchiveOrganizationLanguageInput!) {
  archiveOrganizationLanguage(input: $input) {
    organizationLanguage {
      id
      archived
    }
  }
}
`