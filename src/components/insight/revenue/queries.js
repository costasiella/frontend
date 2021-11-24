import { gql } from "@apollo/client"


export const GET_REVENUE_TOTAL_QUERY = gql`
  query InsightRevenueTotal($year: Int!) {
    insightRevenueTotal(year: $year) {
      description
      data
      year
    }
  }
`


// export const GET_CLASSPASSES_ACTIVE_QUERY = gql`
//   query InsightAccountClasspassesActive($year: Int!) {
//     insightAccountClasspassesActive(year: $year) {
//       description
//       data
//       year
//     }
//   }
// `