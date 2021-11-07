import { gql } from "@apollo/client"

export const GET_ACCOUNT_CLASSPASSES_QUERY = gql`
  query AccountClasspasses($after: String, $before: String, $accountId: ID!) {
    accountClasspasses(first: 15, before: $before, after: $after, account: $accountId) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          organizationClasspass {
            id
            name
          }
          dateStart
          dateEnd
          classesRemainingDisplay
          createdAt
        }
      }
    }
    account(id:$accountId) {
      id
      firstName
      lastName
      email
      phone
      mobile
      isActive
      urlImageThumbnailSmall
    }
  }
`

export const GET_ACCOUNT_CLASSPASS_QUERY = gql`
  query AccountClasspass($id: ID!, $accountId: ID!, $after: String, $before: String) {
    accountClasspass(id:$id) {
      id
      organizationClasspass {
        id
        name
      }
      dateStart
      dateEnd
      note
      createdAt
    }
    organizationClasspasses(first: 100, before: $before, after: $after, archived: false) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          archived
          name
        }
      }
    }
    account(id:$accountId) {
      id
      firstName
      lastName
      email
      phone
      mobile
      isActive
      urlImageThumbnailSmall
    }
  }
`

export const GET_INPUT_VALUES_QUERY = gql`
  query ClasspassInputValues($after: String, $before: String, $accountId: ID!) {
    organizationClasspasses(first: 100, before: $before, after: $after, archived: false) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          archived
          name
        }
      }
    }
    account(id:$accountId) {
      id
      firstName
      lastName
      email
      phone
      mobile
      isActive
      urlImageThumbnailSmall
    }
  }
`

export const CREATE_ACCOUNT_CLASSPASS = gql`
  mutation CreateAccountClasspass($input: CreateAccountClasspassInput!) {
    createAccountClasspass(input: $input) {
      accountClasspass {
        id
        account {
          id
          firstName
          lastName
          email
        }
        organizationClasspass {
          id
          name
        }
        dateStart
        dateEnd
        note
      }
    }
  }
`

export const UPDATE_ACCOUNT_CLASSPASS = gql`
mutation UpdateAccountClasspass($input: UpdateAccountClasspassInput!) {
  updateAccountClasspass(input: $input) {
    accountClasspass {
      id
      account {
        id
        firstName
        lastName
        email
      }
      organizationClasspass {
        id
        name
      }
      dateStart
      dateEnd
      note
    }
  }
}
`

export const DELETE_ACCOUNT_CLASSPASS = gql`
  mutation DeleteAccountClasspass($input: DeleteAccountClasspassInput!) {
    deleteAccountClasspass(input: $input) {
      ok
    }
  }
`
