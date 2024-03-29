import { gql } from "@apollo/client"


export const GET_ORDER_QUERY = gql`
  query FinanceOrder($id: ID!) {
    financeOrder(id: $id) {
      id
      orderNumber
      account {
        id
        fullName
        hasCompleteEnoughProfile
      }
      message
      status
      total
      totalDisplay
      createdAt
      items {
        edges {
          node {
            id
            productName
            description
            quantity
            totalDisplay
            scheduleItem {
              id
            }
            attendanceDate
          }
        }
      }
    }
  }
`
