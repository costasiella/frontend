import { gql } from "@apollo/client"


export const GET_SCHEDULE_ITEM_ENROLLMENTS_QUERY = gql`
  query ScheduleItemEnrollments($after: String, $before: String, $scheduleItem: ID!) {
    scheduleItem(id:$scheduleItem) {
      id
      frequencyType
      frequencyInterval
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
      organizationLevel {
        id
        name
      }
      dateStart
      dateEnd
      timeStart
      timeEnd
      displayPublic
      enrollments(first: 1000, before: $before, after: $after) {
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            id 
            dateStart
            dateEnd
            accountSubscription {
              id
              dateStart
              dateEnd
              organizationSubscription {
                id
                name
              }
              account {
                id
                fullName
              }            
            }
            dateStart
            dateEnd
          }
        }
      }
    }
  }
`


export const GET_SCHEDULE_ITEM_ENROLLMENT_OPTIONS_QUERY = gql`
  query ScheduleItemEnrollmentOptions($after: String, $before: String, $account: ID!, $scheduleItem: ID!, $date: Date!) {
    scheduleClassEnrollmentOptions(account: $account, scheduleItem: $scheduleItem, date: $date) {
      date
      subscriptions {
        allowed
        blocked
        paused
        accountSubscription {
          id
          dateStart
          dateEnd
          organizationSubscription {
            name
          }
        }
      }
    }
    account(id:$account) {
      id
      firstName
      lastName
      fullName
    }
  }
`



export const CREATE_SCHEDULE_ITEM_ENROLLMENT = gql`
  mutation CreateScheduleItemEnrollment($input: CreateScheduleItemEnrollmentInput!) {
    createScheduleItemEnrollment(input:$input) {
      scheduleItemEnrollment {
        id
      }
    }
  }
`

export const UPDATE_SCHEDULE_ITEM_ENROLLMENT = gql`
  mutation UpdateScheduleItemEnrollment($input: UpdateScheduleItemEnrollmentInput!) {
    updateScheduleItemEnrollment(input:$input) {
      scheduleItemEnrollment {
        id
      }
    }
  }
`

export const DELETE_SCHEDULE_ITEM_ENROLLMENT = gql`
  mutation DeleteScheduleItemEnrollment($input: DeleteScheduleItemEnrollmentInput!) {
    deleteScheduleItemEnrollment(input: $input) {
      ok
    }
  }
`


// export const GET_SINGLE_SCHEDULE_CLASS_ACCOUNTS_QUERY = gql`
//   query ScheduleItemAccount($before: String, $after: String, $id: ID!) {
//     scheduleItemAccount(id: $id) {
//       id
//       account {
//         id
//         fullName
//       }
//       role
//       account2 {
//         id
//         fullName
//       }
//       role2
//       dateStart
//       dateEnd       
//     }
//     accounts(first: 15, before: $before, after: $after, isActive: true, instructor: true) {
//       pageInfo {
//         startCursor
//         endCursor
//         hasNextPage
//         hasPreviousPage
//       }
//       edges {
//         node {
//           id
//           fullName
//         }
//       }
//     }
//   }
// `


// export const GET_INPUT_VALUES_QUERY = gql`
//   query InputValues($after: String, $before: String) {
//     accounts(first: 15, before: $before, after: $after, isActive: true, instructor: true) {
//       pageInfo {
//         startCursor
//         endCursor
//         hasNextPage
//         hasPreviousPage
//       }
//       edges {
//         node {
//           id
//           fullName
//         }
//       }
//     }
//   }
// `