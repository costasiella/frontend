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
