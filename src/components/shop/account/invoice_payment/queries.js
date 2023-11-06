import { gql } from "@apollo/client"


export const GET_INVOICE_QUERY = gql`
  query FinanceInvoice($id: ID!) {
    financeInvoice(id:$id) {
      id
      account {
        id
        fullName
      }
      financePaymentMethod {
        id
        name
      }
      relationCompany
      relationCompanyRegistration
      relationCompanyTaxRegistration
      relationContactName
      relationAddress
      relationPostcode
      relationCity
      relationCountry
      status
      summary
      invoiceNumber
      dateSent
      dateDue
      terms
      footer
      note
      subtotalDisplay
      taxDisplay
      total
      totalDisplay
      paidDisplay
      balance
      balanceDisplay
      creditInvoiceNumber
      updatedAt
      items {
        edges {
          node {
            id
            lineNumber
            productName
            description
            quantity
            price
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
            total
            totalDisplay
          }
        }
      }
      payments {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        edges {
          node {
            id
            amount
            amountDisplay
            date
            financePaymentMethod {
              id
              name
            }
            note
          }
        }
      }
    }
  }
`

export const CREATE_PAYMENT_LINK = gql`
mutation CreateFinanceInvoicePaymentLink($id: ID!) {
  createFinanceInvoicePaymentLink(id: $id) {
    financeInvoicePaymentLink {
      paymentLink
    }
  }
}
`
