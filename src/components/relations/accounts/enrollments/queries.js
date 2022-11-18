import { gql } from "@apollo/client"

export const GET_ACCOUNT_ENROLLMENTS_QUERY = gql`
  query ScheduleItemEnrollments($account: ID!, $before: String, $after: String) {
    scheduleItemEnrollments(first: 20, before: $before, after: $after, account: $account) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          dateStart
          dateEnd
          accountSubscription {
            id
            dateStart
            organizationSubscription {
              id
              name
            }
          }
          scheduleItem {
            id
            timeStart
            timeEnd
            organizationLocationRoom {
              name
              organizationLocation {
                name
              }
            }
            organizationClasstype {
              name
            }
          }
        }
      } 
    }
    account(id:$account) {
      id
      firstName
      lastName
      fullName
      email
      phone
      mobile
      isActive
      urlImageThumbnailSmall
    }
  }
`
