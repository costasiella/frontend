import { gql } from "@apollo/client"

export const GET_CLASSTYPES_QUERY = gql`
query OrganizationClasstypes($after: String, $before: String, $archived: Boolean) {
  organizationClasstypes(first: 15, before: $before, after: $after, archived: $archived) {
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
        displayPublic
        name
        description
        urlWebsite
        urlImage
        urlImageThumbnailSmall
      }
    }
  }
}
`

export const GET_CLASSTYPE_QUERY = gql`
query getOrganizationClasstype($id: ID!) {
  organizationClasstype(id:$id) {
    id
    archived
    name
    description
    displayPublic
    urlWebsite
    urlImage
  }
}
`

export const ADD_CLASSTYPE = gql`
mutation CreateOrganizationClasstype($input: CreateOrganizationClasstypeInput!) {
  createOrganizationClasstype(input: $input) {
    organizationClasstype {
      id
      archived
      name
      description
      displayPublic
      urlWebsite
      image
    }
  }
}
`

export const UPDATE_CLASSTYPE = gql`
  mutation UpdateOrganizationClasstype($input: UpdateOrganizationClasstypeInput!) {
    updateOrganizationClasstype(input: $input) {
      organizationClasstype {
        id
        archived
        name
        description
        displayPublic
        urlWebsite
      }
    }
  }
`

export const UPDATE_CLASSTYPE_IMAGE = gql`
mutation UploadOrganizationClasstypeImage($input: UploadOrganizationClasstypeImageInput!) {
  uploadOrganizationClasstypeImage(input: $input) {
    organizationClasstype {
      id
      archived
      name
      description
      displayPublic
      urlWebsite
      image
    }
  }
}
`

export const ARCHIVE_CLASSTYPE = gql`
mutation ArchiveOrganizationClasstype($input: ArchiveOrganizationClasstypeInput!) {
    archiveOrganizationClasstype(input: $input) {
      organizationClasstype {
        id
        archived
      }
    }
}
`
