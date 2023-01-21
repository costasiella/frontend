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
        advance
        reconciled
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
  accountSubscription(id: $accountSubscription) {
    id
    organizationSubscription {
      id
      name
      unlimited
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

export const ADD_ACCOUNT_SUBSCRIPTION_CREDIT = gql`
  mutation CreateAccountSubscriptionCredit($input:CreateAccountSubscriptionCreditInput!) {
    createAccountSubscriptionCredit(input: $input) {
      accountSubscriptionCredit {
        id
      }
    }
  }
`


export const UPDATE_ACCOUNT_SUBSCRIPTION_CREDIT = gql`
  mutation UpdateAccountSubscriptionCredit($input:UpdateAccountSubscriptionCreditInput!) {
    updateAccountSubscriptionCredit(input: $input) {
      accountSubscriptionCredit {
        id
      }
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
