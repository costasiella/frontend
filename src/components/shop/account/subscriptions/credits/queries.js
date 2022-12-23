import { gql } from "@apollo/client"


export const QUERY_ACCOUNT_SUBSCRIPTION_CREDITS = gql`
  query AccountSubscriptionCredits($before: String, $after: String, $accountSubscription: ID!) {
    accountSubscriptionCredits(first: 20, before: $before, after: $after, accountSubscription: $accountSubscription) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          advance
          reconciled
          createdAt
          description
          expiration
          scheduleItemAttendance {
            id
            date
            scheduleItem {
              id
              timeStart
              timeEnd
              organizationClasstype {
                id
                name
              }
              organizationLocationRoom {
                id
                name
                organizationLocation {
                  id 
                  name
                }
              }
            }
          }
          accountSubscription {
            id
            organizationSubscription {
              name
            }
            creditTotal
            dateStart
            dateEnd
          }
        }
      }
    }
  }
`