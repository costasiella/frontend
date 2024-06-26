import { gql } from "@apollo/client"

export const GET_ACCOUNT_ENROLLMENTS_QUERY = gql`
  query ScheduleItemEnrollments($account: ID!, $before: String, $after: String) {
    scheduleItemEnrollments(first: 20, before: $before, after: $after, accountSubscription_Account: $account) {
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
            account {
              id
              fullName
            }
          }
          scheduleItem {
            id
            dateStart
            timeStart
            timeEnd
            frequencyInterval
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
