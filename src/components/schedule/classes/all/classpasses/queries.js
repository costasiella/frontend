import { gql } from "@apollo/client"

export const GET_SCHEDULE_CLASS_CLASSPASSES_QUERY = gql`
  query ScheduleItemOrganizationClasspassGroups($after: String, $before: String, $scheduleItem: ID!) {
    scheduleItemOrganizationClasspassGroups(before: $before, after: $after, scheduleItem: $scheduleItem) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          scheduleItem {
            id
          }
          organizationClasspassGroup {
            id
            name
          }
          shopBook
          attend
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

export const UPDATE_SCHEDULE_CLASS_CLASSPASS = gql`
  mutation UpdateScheduleItemOrganizationClasspassGroup($input: UpdateScheduleItemOrganizationClasspassGroupInput!) {
    updateScheduleItemOrganizationClasspassGroup(input:$input) {
      scheduleItemOrganizationClasspassGroup {
        id
      } 
    }
  }
`