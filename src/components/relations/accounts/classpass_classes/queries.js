import { gql } from "@apollo/client"


export const GET_ACCOUNT_CLASSPASS_CLASSES_QUERY = gql`
  query AccountClasspass($id: ID!, $accountId: ID!, $before: String, $after: String) {
    accountClasspass(id:$id) {
      id
      organizationClasspass {
        id
        name
      }
      dateStart
      dateEnd
      note
      createdAt
      classes(first:100, before:$before, after:$after) {
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            date
            scheduleItem {
              timeStart
              timeEnd
              organizationLocationRoom {
                id
                name
                organizationLocation {
                  id
                  name
                }
              }
              organizationClasstype {
                id
                name
              }
            }
          }
        }
      }
    }
    account(id:$accountId) {
      id
      firstName
      lastName
      email
      phone
      mobile
      isActive
      urlImageThumbnailSmall
    }
  }
`
