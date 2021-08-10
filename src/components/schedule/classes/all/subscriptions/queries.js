import { gql } from "@apollo/client"

export const GET_SCHEDULE_CLASS_SUBSCRIPTIONS_QUERY = gql`
  query ScheduleItemOrganizationSubscriptionGroups($after: String, $before: String, $scheduleItem: ID!) {
    scheduleItemOrganizationSubscriptionGroups(before: $before, after: $after, scheduleItem:$scheduleItem) {
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
          organizationSubscriptionGroup {
            id
            name
          }
          enroll
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

export const UPDATE_SCHEDULE_CLASS_SUBSCRIPTION = gql`
mutation UpdateScheduleItemOrganizationSubscriptionGroup($input: UpdateScheduleItemOrganizationSubscriptionGroupInput!) {
  updateScheduleItemOrganizationSubscriptionGroup(input:$input) {
    scheduleItemOrganizationSubscriptionGroup {
      id
    } 
  }
}
`
