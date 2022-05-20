import { gql } from "@apollo/client"


export const GET_INSIGHT_ACCOUNTS_INACTIVE = gql`
  query InsightAccountInactives {
    insightAccountInactives(first: 100) {
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

export const ADD_INSIGHT_ACCOUNTS_INACTIVE = gql`

`

export const DELETE_INSIGHT_ACCOUNTS_INACTIVE = gql`

`
