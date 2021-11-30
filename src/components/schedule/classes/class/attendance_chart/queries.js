import { gql } from "@apollo/client"


export const GET_CLASS_ATTENDANCE_COUNT_YEAR = gql`
  query InsightClassAttendanceQuery($year: Int!, $scheduleItem: ID!) {
    insightClassAttendanceCountYear(year: $year, scheduleItem: $scheduleItem) {
      description
      dataCurrent
      dataPrevious
      year
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
