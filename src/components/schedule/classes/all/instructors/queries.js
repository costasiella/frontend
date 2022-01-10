import { gql } from "@apollo/client"

export const GET_SCHEDULE_CLASS_ACCOUNTS_QUERY = gql`
  query ScheduleItemAccounts($after: String, $before: String, $scheduleItem: ID!) {
    scheduleItemAccounts(first: 15, before: $before, after: $after, scheduleItem: $scheduleItem) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
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
          dateStart
          dateEnd       
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

export const GET_SINGLE_SCHEDULE_CLASS_ACCOUNTS_QUERY = gql`
  query ScheduleItemAccount($before: String, $after: String, $id: ID!) {
    scheduleItemAccount(id: $id) {
      id
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
      dateStart
      dateEnd       
    }
    accounts(first: 100, before: $before, after: $after, isActive: true, instructor: true) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          fullName
        }
      }
    }
  }
`


export const GET_INPUT_VALUES_QUERY = gql`
  query InputValues($after: String, $before: String) {
    accounts(first: 1000, before: $before, after: $after, isActive: true, instructor: true) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          fullName
        }
      }
    }
  }
`


export const ADD_SCHEDULE_CLASS_INSTRUCTOR = gql`
mutation CreateScheduleItemAccount($input:CreateScheduleItemAccountInput!) {
  createScheduleItemAccount(input:$input) {
    scheduleItemAccount {
      id
    } 
  }
}
`


export const UPDATE_SCHEDULE_CLASS_INSTRUCTOR = gql`
mutation UpdateScheduleItemAccount($input: UpdateScheduleItemAccountInput!) {
  updateScheduleItemAccount(input:$input) {
    scheduleItemAccount {
      id
    } 
  }
}
`


export const DELETE_SCHEDULE_CLASS_INSTRUCTOR = gql`
mutation DeleteScheduleClassInstructor($input: DeleteScheduleItemAccountInput!) {
  deleteScheduleItemAccount(input: $input) {
    ok
  }
}
`