import { gql } from "@apollo/client"


export const GET_SCHEDULE_CLASS_ATTENDANCE_QUERY = gql`
  query ScheduleItemAttendances($after: String, $before: String, $scheduleItem: ID!, $date: Date!) {
    scheduleItemAttendances(first: 100, before: $before, after: $after, scheduleItem: $scheduleItem, date: $date) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          account {
            id
            fullName
          }     
          accountClasspass {
            organizationClasspass {
              name
              trialPass
            }
          }
          attendanceType
          bookingStatus
        }
      }
    }
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
    }
    scheduleClass(scheduleItemId:$scheduleItem, date:$date) {
      scheduleItemId
      frequencyType
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
      date
      timeStart
      timeEnd
      displayPublic
      status
      description
      countAttending
      countBooked
      spaces
    }
  }
`


export const GET_SCHEDULE_CLASS_QUERY = gql`
  query ScheduleClass($scheduleItem: ID!, $date: Date!) {
    scheduleClass(scheduleItemId:$scheduleItem, date:$date) {
      scheduleItemId
      frequencyType
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
      date
      timeStart
      timeEnd
      displayPublic
      status
      description
    }
  }
`

export const DELETE_SCHEDULE_CLASS_ATTENDANCE = gql`
  mutation DeleteScheduleItemAttendance($input: DeleteScheduleItemAttendanceInput!) {
    deleteScheduleItemAttendance(input: $input) {
      ok
    }
  }
`


export const UPDATE_SCHEDULE_ITEM_ATTENDANCE = gql`
  mutation UpdateScheduleItemAttendance($input: UpdateScheduleItemAttendanceInput!) {
    updateScheduleItemAttendance(input:$input) {
      scheduleItemAttendance {
        id
      }
    }
  }
`

export const RESEND_INFO_MAIL_SCHEDULE_ITEM_ATTENDANCE = gql`
  mutation ResendClassInfoMail($input: ResendInfoMailScheduleItemAttendanceInput!) {
    resendInfoMailScheduleItemAttendance(input: $input) {
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