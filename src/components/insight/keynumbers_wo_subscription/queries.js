import { gql } from "@apollo/client"


export const GET_REVENUE_QUERY = gql`
query AccountSubscriptions($after: String, $before: String) {
    accountSubscriptions(first: 25, before: $before, after: $after, account_KeyNumber: "") {
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
