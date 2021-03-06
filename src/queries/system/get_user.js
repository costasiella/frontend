import { gql } from "@apollo/client"

const GET_USER = gql`
  query User($before: String, $after: String)  {
    user {
      id
      isActive
      email
      firstName
      lastName
      employee
      instructor
      urlImageThumbnailSmall
      groups {
        edges {
          node {
            id
            name
            permissions(first: 1000, before: $before, after: $after) {
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor                
              }
              edges {
                node {
                  id
                  name
                  codename
                }
              }
            }
          }
        }
      }
    }
  }
`

export default GET_USER