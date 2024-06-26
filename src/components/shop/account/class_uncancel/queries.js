import { gql } from "@apollo/client"


export const GET_ACCOUNT_CLASS_QUERY = gql`
  query ScheduleItemAttendance($scheduleItemId:ID!, $date:Date!, $id: ID!) {
    scheduleClass(scheduleItemId: $scheduleItemId, date:$date) {
      scheduleItemId
      frequencyType
      date
      organizationClasstype {
        name
      }
      organizationLocationRoom {
        organizationLocation {
          name
        }
      }
          timeStart
      timeEnd
      infoMailContent
    }
    scheduleItemAttendance(id: $id) {
      id
      uncancellationPossible
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