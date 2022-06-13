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
  }
`
