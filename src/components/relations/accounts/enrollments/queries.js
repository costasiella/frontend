import { gql } from "@apollo/client"

export const GET_ACCOUNT_ENROLLMENTS_QUERY = gql`
  query ScheduleItemEnrollments($account: ID!, $before: String, $after: String) {
    scheduleItemEnrollments(first: 20, before: $before, after: $after, accountSubscription_Account: $account) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          id
          dateStart
          dateEnd
          accountSubscription {
            id
            dateStart
            organizationSubscription {
              id
              name
            }
          }
          scheduleItem {
            id
            timeStart
            timeEnd
            frequencyInterval
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
      } 
    }
    account(id:$account) {
      id
      firstName
      lastName
      fullName
      email
      phone
      mobile
      isActive
      urlImageThumbnailSmall
    }
  }
`

export const CREATE_SCHEDULE_ITEM_ENROLLMENT = gql`
  mutation CreateScheduleItemEnrollment($input: CreateScheduleItemEnrollmentInput!) {
    createScheduleItemEnrollment(input:$input) {
      scheduleItemEnrollment {
        id
      }
    }
  }
`

export const UPDATE_SCHEDULE_ITEM_ENROLLMENT = gql`
  mutation UpdateScheduleItemEnrollment($input: UpdateScheduleItemEnrollmentInput!) {
    updateScheduleItemEnrollment(input:$input) {
      scheduleItemEnrollment {
        id
      }
    }
  }
`

export const DELETE_SCHEDULE_ITEM_ENROLLMENT = gql`
  mutation DeleteScheduleItemEnrollment($input: DeleteScheduleItemEnrollmentInput!) {
    deleteScheduleItemEnrollment(input: $input) {
      ok
    }
  }
`
