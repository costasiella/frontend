import { gql } from "@apollo/client"

export const GET_ACCOUNT_SUBSCRIPTION_QUERY = gql`
  query AccountSubscription($id: ID!) {
    accountSubscription(id:$id) {
      id
      organizationSubscription {
        id
        name
      }
      financePaymentMethod {
        id
        name
      }
      dateStart
      dateEnd
      note
      creditTotal
      registrationFeePaid
      createdAt
    }
  }
`