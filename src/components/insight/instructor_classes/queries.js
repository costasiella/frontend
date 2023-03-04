import { gql } from "@apollo/client"

export const GET_INSTRUCTORS_QUERY = gql`
query Instructors {
    instructors(first: 1000) {
    edges {
      node {
        id
        fullName
      }
    }
  }
}
`

export const GET_INSTRUCTORS_CLASSES_MONTH_CLASSES = gql`
query InsightInstructorClassesMonth($year:Int!, $month:Int!, $instructor: ID!) {
  insightInstructorClassesMonth(year: $year, month:$month, instructor: $instructor) {
    year
    month
    instructor
    classes {
      scheduleItemId,
      frequencyType,
      organizationClasstype {
        id
        name
      }
      organizationLocationRoom {
        id
        name
        organizationLocation {
          id
          name
        }
      }
      date
    	timeStart
      status
      description
    }
  }
}
`