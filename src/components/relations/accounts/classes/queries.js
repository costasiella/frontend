import { gql } from "@apollo/client"

export const GET_ACCOUNT_CLASSES_QUERY = gql`
  query ScheduleItemAttendance($account: ID!, $before: String, $after: String) {
    scheduleItemAttendances(first: 20, before: $before, after: $after, account: $account, accountScheduleEventTicket_Isnull: true) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          attendanceType
          date
          bookingStatus
          scheduleItem {
            id
            timeStart
            timeEnd
            organizationLocationRoom {
              name
              organizationLocation {
                name
              }
            }
            organizationClasstype {
              name
            }
          }
        }
      } 
    }
    account(id:$account) {
      id
      firstName
      lastName
      fullName
      email
      phone
      mobile
      isActive
      urlImageThumbnailSmall
    }
  }
`
