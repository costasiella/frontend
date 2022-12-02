import { gql } from "@apollo/client"


export const GET_INSIGHT_SUBSCRIPTIONS_QUERY = gql`
  query InsightAccountSubscriptions($year: Int!) {
    insightAccountSubscriptions(year: $year) {
      year
      months {
        month
        sold
        stopped
        active
      }
    }
  }
`
