import { gql } from "@apollo/client"

export const GET_INSTRUCTORS_QUERY = gql`
query Instructors {
    instructors(first: 1000) {
    edges {
      node {
        id
        fullName
      }
    }
  }
}
`
