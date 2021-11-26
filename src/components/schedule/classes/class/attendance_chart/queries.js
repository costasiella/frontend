import { gql } from "@apollo/client"


export const GET_CLASS_ATTENDANCE_COUNT_YEAR = gql`
  query InsightClassAttendanceQuery($year: Int!, $scheduleItem: ID!) {
    insightClassAttendanceCountYear(year: $year, scheduleItem: $scheduleItem) {
      description
      data
      year
    }
  }
`
