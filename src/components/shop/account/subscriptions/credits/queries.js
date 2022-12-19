import { gql } from "@apollo/client"


export const QUERY_ACCOUNT_SUBSCRIPTION_CREDITS = gql`
  query AccountSubscriptionCredits($before: String, $after: String, $accountSubscription: ID!) {
    accountSubscriptionCredits(first: 100, before: $before, after: $after, accountSubscription: $accountSubscription) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
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
    user {
      id
      accountId
      firstName
      lastName
      fullName
      email
      gender
      dateOfBirth
      address
      postcode
      city
      country
      phone
      mobile
      emergency
    }
  }
`