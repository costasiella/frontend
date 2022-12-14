import { gql } from "@apollo/client"

export const GET_ACCOUNT_SUBSCRIPTION_CREDITS_QUERY = gql`
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
        accountSubscription {
          id
        }
        description
        expiration
        expired
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
        createdAt
      }
    } 
  }
}
`

export const GET_ACCOUNT_SUBSCRIPTION_CREDIT_QUERY = gql`
query AccountSubscriptionCredit($id: ID!) {
  accountSubscriptionCredit(id:$id) {
    id
    accountSubscription {
      id
    }
    expiration
    description
    createdAt
  }
}
`


export const DELETE_ACCOUNT_SUBSCRIPTION_CREDIT = gql`
  mutation DeleteAccountSubscriptionCredit($input: DeleteAccountSubscriptionCreditInput!) {
    deleteAccountSubscriptionCredit(input: $input) {
      ok
    }
  }
`
