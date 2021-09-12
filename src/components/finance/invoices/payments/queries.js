import { gql } from "@apollo/client"


export const GET_INVOICE_PAYMENT_QUERY = gql`
  query FinanceInvoicePayment($id: ID!) {
    financeInvoicePayment(id:$id) {
      id
      date
      amount
      financePaymentMethod {
        id
        name
      }
      note
      onlinePaymentId
    }
  }
`

export const UPDATE_FINANCE_INVOICE_PAYMENT = gql`
  mutation UpdateFinanceInvoicePayment($input:UpdateFinanceInvoicePaymentInput!) {
    updateFinanceInvoicePayment(input:$input) {
      financeInvoicePayment {
        id
      } 
    }
  }
`
