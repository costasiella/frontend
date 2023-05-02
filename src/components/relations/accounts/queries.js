import { gql } from "@apollo/client"

export const GET_ACCOUNTS_QUERY = gql`
query Accounts(
  $after: String, 
  $before: String, 
  $isActive: Boolean!, 
  $searchName: String,
  $customer: Boolean,
  $instructor: Boolean,
  $employee: Boolean,
  $orderBy: String!
) {
  accounts(
    first: 15, 
    before: $before, 
    after: $after, 
    isActive: $isActive, 
    fullName_Icontains: $searchName,
    customer: $customer,
    instructor: $instructor,
    employee: $employee,
    orderBy: $orderBy,
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
        instructor
        employee
        firstName
        lastName
        fullName
        email
        phone
        mobile
        isActive
        urlImageThumbnailSmall
        subscriptionsLatest {
          organizationSubscription {
            id
            name
          }
          dateStart
          dateEnd
        }
        classpassesLatest {
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
`

export const GET_ACCOUNT_QUERY = gql`
  query Account($id: ID!) {
    account(id:$id) {
      id
      customer
      instructor
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
      keyNumber
      mollieCustomerId
      urlImageThumbnailSmall
      organizationDiscovery {
        id
      }
      organizationLanguage {
        id
      }
      invoiceToBusiness {
        id
      }
    }
    organizationDiscoveries(first: 100){
      edges {
        node {
          id
          name
        }
      }
    }
    organizationLanguages(first: 100) {
      edges {
        node {
          id
          name
        }
      }
    }
    businesses(first: 100) {
      edges {
        node {
          id
          name
        }
      }
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