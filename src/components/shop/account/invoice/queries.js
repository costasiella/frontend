import { gql } from "@apollo/client"


export const QUERY_ACCOUNT_INVOICE = gql`
  query FinanceInvoice($id: ID!) {
    financeInvoice(id: $id) {
      id
      invoiceNumber
      status
      summary
      relationCompany
      relationContactName
      dateSent
      dateDue
      total
      totalDisplay
      balance
      balanceDisplay
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
            financeGlaccount {
              id
              name
            }
            financeCostcenter {
              id
              name
            }
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
            onlinePaymentId
          }
        }
      }
    }
    user {
      id
      accountId
      firstName
      lastName
      fullName
      email
      gender
      dateOfBirth
      address
      postcode
      city
      country
      phone
      mobile
      emergency
    }
  }
`

