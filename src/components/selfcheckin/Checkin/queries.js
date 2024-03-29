import { gql } from "@apollo/client"

export const GET_ACCOUNTS_QUERY = gql`
  query Accounts(
    $after: String, 
    $before: String, 
    $searchName: String
  ) {
    accounts(
      first: 25, 
      before: $before, 
      after: $after, 
      isActive: true, 
      fullName_Icontains: $searchName,
      customer: true
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


export const GET_SCHEDULE_CLASS_ATTENDANCE_QUERY = gql`
  query ScheduleItemAttendances($after: String, $before: String, $scheduleItem: ID!, $date: Date!) {
    scheduleItemAttendances(first: 1000, before: $before, after: $after, scheduleItem: $scheduleItem, date: $date) {
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
