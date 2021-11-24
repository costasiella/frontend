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


export const GET_REVENUE_SUBTOTAL_QUERY = gql`
  query InsightRevenueSubTotal($year: Int!) {
    insightRevenueSubtotal(year: $year) {
      description
      data
      year
    }
  }
`
