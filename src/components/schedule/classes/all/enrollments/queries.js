import { gql } from "@apollo/client"


export const GET_SCHEDULE_ITEM_ENROLLMENTS_QUERY = gql`
  query ScheduleItemEnrollments($after: String, $before: String, $scheduleItem: ID!) {
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
      enrollments(first: 1000, before: $before, after: $after, scheduleItem: $scheduleItem) {
        pageInfo {
          startCursor
          endCursor
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            id 
            dateStart
            dateEnd
            accountSubscription {
              id
              dateStart
              dateEnd
              organizationSubscription {
                id
                name
              }
              account {
                id
                fullName
              }            
            }
            dateStart
            dateEnd
          }
        }
      }
    }
  }
`

export const GET_SCHEDULE_ITEM_ENROLLMENT_QUERY = gql`
  query ScheduleItemEnrollment($id: ID!) {
    scheduleItemEnrollment(id: $id) {
      id
      dateStart
      dateEnd
      accountSubscription {
        id
        organizationSubscription {
          id
          name
        }
        account {
          id
          fullName
        }
      }   
    }
  }
`


export const GET_SCHEDULE_ITEM_ENROLLMENT_OPTIONS_QUERY = gql`
  query ScheduleItemEnrollmentOptions($account: ID!, $scheduleItem: ID!) {
    scheduleClassEnrollmentOptions(account: $account, scheduleItem: $scheduleItem) {
      subscriptions {
        allowed
        blocked
        paused
        accountSubscription {
          id
          dateStart
          dateEnd
          organizationSubscription {
            name
          }
        }
      }
    }
    account(id:$account) {
      id
      firstName
      lastName
      fullName
    }
  }
`

export const GET_ACCOUNT_SUBSCRIPTION_QUERY = gql`
  query AccountSubscription($id: ID!) {
    accountSubscription(id:$id) {
      id
      account {
        id
        fullName
      }
      organizationSubscription {
        id
        name
      }
      financePaymentMethod {
        id
        name
      }
      dateStart
      dateEnd
      note
      creditTotal
      registrationFeePaid
      createdAt
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
