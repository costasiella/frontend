import { gql } from "@apollo/client"

export const GET_BACKEND_ANNOUNCEMENTS_QUERY = gql`
  query OrganizationAnnouncements($after: String, $before: String) {
    organizationAnnouncements(first: 100, before: $before, after: $after, displayPublic: true, displayBackend: true) {
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
  }
`

export const GET_BACKEND_INSTRUCTOR_UPCOMING_CLASSES_QUERY = gql`
query ScheduleClasses(
  $dateFrom: Date!, 
  $dateUntil:Date!, 
  $orderBy: String, 
  $instructor: ID!
  $attendanceCountType: String!
){
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
