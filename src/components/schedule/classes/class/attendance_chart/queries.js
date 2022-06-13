import { gql } from "@apollo/client"


export const GET_CLASS_ATTENDANCE_COUNT_YEAR = gql`
  query InsightClassAttendanceCountYear($scheduleItem:ID!, $year: Int!) {
    insightClassAttendanceCountYear(scheduleItem: $scheduleItem, year: $year) {
      year
      scheduleItem
      weeks {
        week
        attendanceCountCurrentYear
        attendanceCountPreviousYear
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
