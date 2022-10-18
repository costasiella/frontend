import { gql } from "@apollo/client"

export const GET_NOTIFICATIONS_QUERY = gql`
  query systemNotifications($after: String, $before: String) {
    systemNotifications(first: 15, before: $before, after: $after) {
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
          accounts {
            edges {
              node {
                id
                fullName
                email
              }
            }
          }
        }
      }
    }
  }
`

export const CREATE_NOTIFICATION_ACCOUNT = gql`
  mutation CreateSystemNotificationAccount($input:CreateSystemNotificationAccountInput!) {
    createSystemNotificationAccount(input:$input) {
      systemNotificationAccount {
        id
      }
    }
  }
`

export const DELETE_NOTIFICATION_ACCOUNT = gql`
  mutation DeleteSystemNotificationAccount($input:DeleteSystemNotificationAccountInput!) {
    deleteSystemNotificationAccount(input:$input) {
      ok
    }
  }
`
