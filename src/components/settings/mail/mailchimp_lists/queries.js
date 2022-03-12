import { gql } from "@apollo/client"

export const GET_MAILCHIMP_LISTS_QUERY = gql`
  query systemMailchimpLists($after: String, $before: String) {
    systemMailchimpLists(first: 15, before: $before, after: $after) {
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
          frequency
          mailchimpListId
        }
      }
    }
  }
`

export const GET_MAILCHIMP_LIST_QUERY = gql`
  query SystemMailchimpList($id: ID!) {
    systemMailchimpList(id:$id) {
      id
      name
      description
      frequency
      mailchimpListId
    }
  }
`

export const ADD_MAILCHIMP_LIST = gql`
  mutation CreateSystemMailChimpList($input:CreateSystemMailChimpListInput!) {
    createSystemMailchimpList(input: $input) {
      systemMailchimpList{
        id
      }
    }
  }
`

export const UPDATE_MAILCHIMP_LIST = gql`
  mutation UpdateSystemMailChimpList($input:UpdateSystemMailChimpListInput!) {
    updateSystemMailchimpList(input: $input) {
      systemMailchimpList{
        id
      }
    }
  }
`

// export const ARCHIVE_DISCOVERY = gql`
// mutation ArchiveOrganizationDiscovery($input: ArchiveOrganizationDiscoveryInput!) {
//   archiveOrganizationDiscovery(input: $input) {
//     organizationDiscovery {
//       id
//       archived
//     }
//   }
// }
// `
