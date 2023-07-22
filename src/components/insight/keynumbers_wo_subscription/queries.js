import { gql } from "@apollo/client"


export const GET_ACCOUNT_SUBSCRIPTIONS_WO_KEYNUMBER_QUERY = gql`
query AccountSubscriptions($after: String, $before: String) {
    accountSubscriptions(first: 25, before: $before, after: $after, account_KeyNumber_Isempty: true) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          organizationSubscription {
            id
            name
            unlimited
          }
          financePaymentMethod {
            id
            name
          }
          dateStart
          dateEnd
          creditTotal
          registrationFeePaid
          account {
            id
            fullName
            keyNumber            
          }
          createdAt
        }
      }
    }
  }
`
