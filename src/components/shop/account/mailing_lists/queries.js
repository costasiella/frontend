import { gql } from "@apollo/client"


export const QUERY_SYSTEM_MAILCHIMP_LISTS = gql`
  query SystemMailchimpLists($before: String, $after: String) {
    systemMailchimpLists(first: 100, before: $before, after: $after) {
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
          description
          frequency
          subscribed
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