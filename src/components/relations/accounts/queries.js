import { gql } from "@apollo/client"

export const GET_ACCOUNTS_QUERY = gql`
query Accounts(
  $after: String, 
  $before: String, 
  $isActive: Boolean!, 
  $searchName: String,
  $customer: Boolean,
  $teacher: Boolean,
  $employee: Boolean
  
) {
  accounts(
    first: 15, 
    before: $before, 
    after: $after, 
    isActive: $isActive, 
    fullName_Icontains: $searchName,
    customer: $customer,
    teacher: $teacher,
    employee: $employee
  ) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        id
        customer
        teacher
        employee
        firstName
        lastName
        email
        isActive
        subscriptions(last: 2) {
          edges {
            node {
              organizationSubscription {
                id
                name
              }
              dateStart
              dateEnd
            }
          }
        }
        classpasses(last: 2) {
          edges {
            node {
              id
              organizationClasspass {
                id
                name
              }
              dateStart
              dateEnd
              classesRemaining
              classesRemainingDisplay
              isExpired
            }
          }
        }
      }
    }
  }
}
`

export const GET_ACCOUNT_QUERY = gql`
  query Account($id: ID!) {
    account(id:$id) {
      id
      customer
      teacher
      employee
      firstName
      lastName
      email
      dateOfBirth
      gender
      address
      postcode
      city
      country
      phone
      mobile
      emergency
      isActive
    }
  }
`

export const ADD_ACCOUNT = gql`
  mutation CreateAccount($input:CreateAccountInput!) {
    createAccount(input: $input) {
      account {
        id
        firstName
        lastName
        email
      }
    }
  }
`

export const UPDATE_ACCOUNT = gql`
  mutation UpdateAccount($input:UpdateAccountInput!) {
    updateAccount(input: $input) {
      account {
        id
        firstName
        lastName
        email
      }
    }
  }
`

export const UPDATE_ACCOUNT_ACTIVE = gql`
  mutation UpdateAccountActive($input: UpdateAccountActiveInput!) {
    updateAccountActive(input: $input) {
      account {
        id
        isActive
      }
    }
  }
`

export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($input: DeleteAccountInput!) {
    deleteAccount(input: $input) {
      ok
    }
  }
`