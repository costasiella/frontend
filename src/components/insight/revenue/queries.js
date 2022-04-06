import { gql } from "@apollo/client"


export const GET_REVENUE_QUERY = gql`
  query InsightRevenueTotal($year: Int!) {
    insightRevenueTotal(year: $year) {
      description
      year
      total
      subtotal
      tax
    }
    insightRevenueClasspasses(year: $year) {
      description
      year
      total
      subtotal
      tax
    }
    insightRevenueSubscriptions(year: $year) {
      description
      year
      total
      subtotal
      tax
    }
    insightRevenueEventTickets(year: $year) {
      description
      year
      total
      subtotal
      tax
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

export const GET_REVENUE_TOTAL_CLASSPASSES_QUERY = gql`
  query InsightRevenueTotalClasspasses($year: Int!) {
    insightRevenueTotalClasspasses(year: $year) {
      description
      data
      year
    }
  }
`


export const GET_REVENUE_SUBTOTAL_CLASSPASSES_QUERY = gql`
  query InsightRevenueSubTotalClasspasses($year: Int!) {
    insightRevenueSubtotalClasspasses(year: $year) {
      description
      data
      year
    }
  }
`


export const GET_REVENUE_TAX_CLASSPASSES_QUERY = gql`
  query InsightRevenueTaxClasspasses($year: Int!) {
    insightRevenueTaxClasspasses(year: $year) {
      description
      data
      year
    }
  }
`

export const GET_REVENUE_TOTAL_EVENT_TICKETS_QUERY = gql`
  query InsightRevenueTotalEventTickets($year: Int!) {
    insightRevenueTotalEventTickets(year: $year) {
      description
      data
      year
    }
  }
`


export const GET_REVENUE_SUBTOTAL_EVENT_TICKETS_QUERY = gql`
  query InsightRevenueSubTotalEventTickets($year: Int!) {
    insightRevenueSubtotalEventTickets(year: $year) {
      description
      data
      year
    }
  }
`


export const GET_REVENUE_TAX_EVENT_TICKETS_QUERY = gql`
  query InsightRevenueTaxEventTickets($year: Int!) {
    insightRevenueTaxEventTickets(year: $year) {
      description
      data
      year
    }
  }
`

export const GET_REVENUE_TOTAL_OTHER_QUERY = gql`
  query InsightRevenueTotalOther($year: Int!) {
    insightRevenueTotalOther(year: $year) {
      description
      data
      year
    }
  }
`


export const GET_REVENUE_SUBTOTAL_OTHER_QUERY = gql`
  query InsightRevenueSubTotalOther($year: Int!) {
    insightRevenueSubtotalOther(year: $year) {
      description
      data
      year
    }
  }
`


export const GET_REVENUE_TAX_OTHER_QUERY = gql`
  query InsightRevenueTaxOther($year: Int!) {
    insightRevenueTaxOther(year: $year) {
      description
      data
      year
    }
  }
`
