import { gql } from "@apollo/client"


export const GET_REVENUE_QUERY = gql`
  query InsightRevenueTotal($year: Int!) {
    insightRevenueTotal(year: $year) {
      description
      year
      total
      totalDisplay
      subtotal
      tax
    }
    insightRevenueClasspasses(year: $year) {
      description
      year
      total
      totalDisplay
      subtotal
      tax
    }
    insightRevenueSubscriptions(year: $year) {
      description
      year
      total
      totalDisplay
      subtotal
      tax
    }
    insightRevenueEventTickets(year: $year) {
      description
      year
      total
      totalDisplay
      subtotal
      tax
    }
    insightRevenueOther(year: $year) {
      description
      year
      total
      totalDisplay
      subtotal
      tax
    }
  }
`
