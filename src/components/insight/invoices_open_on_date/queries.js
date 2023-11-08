import { gql } from "@apollo/client"

export const GET_INSIGHT_FINANCE_OPEN_INVOICES_QUERY = gql`
  query InsightFinanceOpenInvoices($date: Date!) {
    insightFinanceOpenInvoices(date:$date) {
      date
      totalOpenOnDate
      totalOpenOnDateDisplay
      financeInvoices {
        id
        invoiceNumber
        status
        dateSent
        totalDisplay
        paidDisplay
        balanceDisplay
        account {
          id
          fullName
        }
        business {
          id
          name
        }
      }
    }
  }
`