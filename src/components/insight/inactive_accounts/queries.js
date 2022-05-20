import { gql } from "@apollo/client"


export const GET_INSIGHT_ACCOUNTS_INACTIVE = gql`
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
