import { gql } from "@apollo/client"

export const GET_QUOTES_QUERY = gql`
  query FinanceQuotes($after: String, $before: String, $status: String) {
    financeQuotes(first: 15, before: $before, after: $after, status: $status) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          account {
            id
            fullName
          }
          business {
            id
            name
          }
          quoteNumber
          status
          summary
          relationCompany
          relationContactName
          dateSent
          dateExpire
          total
          totalDisplay
        }
      }
    }
  }
`

export const GET_QUOTE_QUERY = gql`
  query FinanceQuote($id: ID!, $before: String, $after: String) {
    financeQuote(id:$id) {
      id
      account {
        id
        fullName
      }
      business {
        id
        name
      }
      financePaymentMethod {
        id
        name
      }
      customTo
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
      quoteNumber
      dateSent
      dateExpire
      terms
      footer
      note
      subtotalDisplay
      taxDisplay
      total
      totalDisplay
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
    }
    businesses(first: 100, archived: false) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          name
        }
      }
    }
    financeTaxRates(first: 100, before: $before, after: $after, archived: false) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          name
          percentage
          rateType
        }
      }
    }
    organization(id:"T3JnYW5pemF0aW9uTm9kZToxMDA=") {
      id
      name
      address
      phone
      email
      registration
      taxRegistration
    }
  }
`


export const UPDATE_QUOTE = gql`
  mutation UpdateFinanceQuote($input: UpdateFinanceQuoteInput!) {
    updateFinanceQuote(input: $input) {
      financeQuote {
        id
        summary
      }
    }
  }
`

export const DELETE_FINANCE_QUOTE = gql`
  mutation DeleteFinanceQuote($input: DeleteFinanceQuoteInput!) {
    deleteFinanceQuote(input: $input) {
      ok
    }
  }
`


export const CREATE_QUOTE_ITEM = gql`
  mutation CreateFinanceQuoteItem($input: CreateFinanceQuoteItemInput!) {
    createFinanceQuoteItem(input: $input) {
      financeQuoteItem {
        id
        productName
        description
        quantity
        price
        financeTaxRate {
          id
          name
        }
      }
    }
  }
`


export const UPDATE_QUOTE_ITEM = gql`
  mutation UpdateFinanceQuoteItem($input: UpdateFinanceQuoteItemInput!) {
    updateFinanceQuoteItem(input: $input) {
      financeQuoteItem {
        id
        productName
        description
        quantity
        price
        financeTaxRate {
          id
          name
        }
      }
    }
  }
`


export const DELETE_QUOTE_ITEM = gql`
  mutation DeleteFinanceQuoteItem($input: DeleteFinanceQuoteItemInput!) {
    deleteFinanceQuoteItem(input: $input) {
      ok
    }
  }
`
