import { gql } from "@apollo/client"


export const QUERY_ACCOUNT_INVOICE = gql`
  query FinanceInvoice($id: ID!) {
    financeInvoice(id: $id) {
      id
      business {
        id
        name
      }
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
            priceDisplay
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
