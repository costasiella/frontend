import { gql } from "@apollo/client"


export const GET_REVENUE_QUERY = gql`
  query InsightRevenueTotal($year: Int!) {
    insightRevenueTotal(year: $year) {
      year
      months {
        month
        total
        totalDisplay
        subtotal
        tax
      }
    }
    insightRevenueClasspasses(year: $year) {
      year
      months {
        month
        total
        totalDisplay
        subtotal
        tax
      }
    }
    insightRevenueSubscriptions(year: $year) {
      year
      months {
        month
        total
        totalDisplay
        subtotal
        tax
      }
    }
    insightRevenueEventTickets(year: $year) {
      year
      months {
        month
        total
        totalDisplay
        subtotal
        tax
      }
    }
    insightRevenueOther(year: $year) {
      year
      months {
        month
        total
        totalDisplay
        subtotal
        tax
      }
    }
  }
`
