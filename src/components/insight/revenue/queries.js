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


export const GET_REVENUE_TAX_QUERY = gql`
  query InsightRevenueTax($year: Int!) {
    insightRevenueTax(year: $year) {
      description
      data
      year
    }
  }
`

export const GET_REVENUE_TOTAL_SUBSCRIPTIONS_QUERY = gql`
  query InsightRevenueTotalSubscriptions($year: Int!) {
    insightRevenueTotalSubscriptions(year: $year) {
      description
      data
      year
    }
  }
`


export const GET_REVENUE_SUBTOTAL_SUBSCRIPTIONS_QUERY = gql`
  query InsightRevenueSubTotalSubscriptions($year: Int!) {
    insightRevenueSubtotalSubscriptions(year: $year) {
      description
      data
      year
    }
  }
`


export const GET_REVENUE_TAX_SUBSCRIPTIONS_QUERY = gql`
  query InsightRevenueTaxSubscriptions($year: Int!) {
    insightRevenueTaxSubscriptions(year: $year) {
      description
      data
      year
    }
  }
`
