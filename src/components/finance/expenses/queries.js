import { gql } from "@apollo/client"

export const GET_EXPENSES_QUERY = gql`
  query FinanceExpenses($after: String, $before: String) {
    financeExpenses(first: 15, before: $before, after: $after) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          date
          summary
          description
          amountDisplay
          taxDisplay
          percentageDisplay
          totalAmountDisplay
          totalTaxDisplay
          totalDisplay
          supplier {
            id
            name
          }
          financeGlaccount {
            id
            name
            code
          }
          financeCostcenter {
            id
            name
            code
          }
          urlProtectedDocument
        }
      }
    }
  }
`

export const GET_EXPENSE_QUERY = gql`
  query FinanceExpense($id: ID!) {
    financeExpense(id:$id) {
      id
      date
      summary
      description
      amount
      tax
      percentage
      total
      supplier {
        id
        name
      }
      financeGlaccount {
        id
        name
        code
      }
      financeCostcenter {
        id
        name
        code
      }
      document
    }
    businesses(first: 100, archived: false, supplier: true) {
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
    financeGlaccounts(first: 100, archived: false) {
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
          code
        }
      }
    }
    financeCostcenters(first: 100, archived: false) {
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
          code
        }
      }
    }
  }
`

export const GET_INPUT_VALUES_QUERY = gql`
  query ExpenseInputValues {
    financeGlaccounts(first: 100, archived: false) {
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
          code
        }
      }
    }
    financeCostcenters(first: 100, archived: false) {
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
          code
        }
      }
    }
    businesses(first: 100, supplier: true, archived: false) {
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
    
  }
`

export const CREATE_FINANCE_EXPENSE = gql`
  mutation CreateFinanceExpense($input: CreateFinanceExpenseInput!) {
    createFinanceExpense(input: $input) {
      financeExpense {
        id
      }
    }
  }
`

export const UPDATE_FINANCE_EXPENSE = gql`
  mutation UpdateFinanceExpense($input: UpdateFinanceExpenseInput!) {
    updateFinanceExpense(input: $input) {
      financeExpense {
        id
      }
    }
  }
`

export const DELETE_FINANCE_EXPENSE = gql`
  mutation DeleteFinanceExpense($input: DeleteFinanceExpenseInput!) {
    deleteFinanceExpense(input: $input) {
      ok
    }
  }
`
