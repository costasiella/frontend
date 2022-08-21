import { gql } from "@apollo/client"

export const GET_BACKEND_ANNOUNCEMENTS_QUERY = gql`
  query OrganizationAnnouncements(
    $dateFrom: Date!, 
    $dateUntil:Date!, 
    $orderBy: String, 
    $instructor: ID!
    $attendanceCountType: String!
  ) {
    organizationAnnouncements(first: 100 displayPublic: true, displayBackend: true) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          displayPublic
          displayBackend
          title
          content
          dateStart
          dateEnd
          priority
        }
      }
    }
    scheduleClasses(
        dateFrom:$dateFrom, 
        dateUntil: $dateUntil, 
        orderBy: $orderBy, 
        instructor: $instructor,
        attendanceCountType: $attendanceCountType,
        publicOnly: false
    ){
      date
      bookingOpenOn
      classes {
        scheduleItemId
        frequencyType
        date
        status
        holiday
        holidayName
        description
        account {
          id
          fullName
        }
        role
        account2 {
          id
          fullName
        }
        role2
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
        timeStart
        timeEnd
        spaces
        countAttendance
        availableSpacesOnline
        availableSpacesTotal
        displayPublic
        bookingStatus
      }
    }
  }
`


// Example vars:
// {
//   "dateFrom": "2022-08-17",
//   "dateUntil": "2022-08-20",
//   "orderBy": "starttime",
//   "instructor": "QWNjb3VudE5vZGU6Mg==",
//   "attendanceCountType": "ATTENDING_AND_BOOKED"
// }