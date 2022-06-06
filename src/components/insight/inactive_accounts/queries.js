import { gql } from "@apollo/client"


export const GET_INSIGHT_ACCOUNTS_INACTIVES = gql`
  query InsightAccountInactives {
    insightAccountInactives(first: 100) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          noActivityAfterDate 
          countInactiveAccounts
          countDeletedInactiveAccounts
          createdAt
        }
      }
    }
  }
`


export const GET_INSIGHT_ACCOUNTS_INACTIVE = gql`
  query InsightAccountInactive($id: ID!) {
    insightAccountInactive(id: $id) {
      id
      noActivityAfterDate
      countInactiveAccounts
      createdAt
      accounts {
        edges {
          node {
            account {
              id
              fullName
              email
            }
          }
        }
      }
    }
  }
`

export const ADD_INSIGHT_ACCOUNTS_INACTIVE = gql`
  mutation CreateInsightAccountInactive($input: CreateInsightAccountInactiveInput!) {
    createInsightAccountInactive(input: $input) {
      insightAccountInactive {
        id
      }
    }
  }
`

export const DELETE_INSIGHT_ACCOUNTS_INACTIVE = gql`
  mutation deleteInsightAccountInactive($input: DeleteInsightAccountInactiveInput!) {
    deleteInsightAccountInactive(input: $input){
      ok
    }
  }
`

export const DELETE_INSIGHT_ACCOUNTS_INACTIVE_ACCOUNTS = gql`
  mutation deleteInsightAccountInactiveAccounts($input: DeleteInsightAccountInactiveAccountsInput!) {
    deleteInsightAccountInactiveAccounts(input: $input){
      ok
    }
  } 
`
