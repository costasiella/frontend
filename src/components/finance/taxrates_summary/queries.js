import { gql } from "@apollo/client"

export const GET_INSIGHT_FINANCE_TAX_SUMMARY_QUERY = gql`
  query InsightFinanceTaxSummary($dateStart: Date!, $dateEnd: Date!) {
    insightFinanceTaxRateSummary(dateStart:$dateStart, dateEnd: $dateEnd) {
      dateStart
      dateEnd
      data {
        financeTaxRate {
          id
          name
          percentage
          rateType        
        }
        subtotal
        subtotalDisplay
        tax
        taxDisplay
      }
    }
  }
`