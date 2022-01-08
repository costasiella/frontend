import { gql } from "@apollo/client"

export const GET_ACCOUNTS_QUERY = gql`
  query Accounts(
    $after: String, 
    $before: String, 
    $searchName: String,
    $instructor: Boolean,
    $employee: Boolean
  ) {
    accounts(
      first: 25, 
      before: $before, 
      after: $after, 
      isActive: true, 
      fullName_Icontains: $searchName,
      customer: true,
      instructor: $instructor,
      employee: $employee
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          fullName
          email
          isActive
        }
      }
    }
  }
`