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
          createdAt
        }
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