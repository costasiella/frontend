import { gql } from "@apollo/client"

export const GET_SCHEDULE_SHIFT_ACCOUNTS_QUERY = gql`
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
          account2 {
            id
            fullName
          }
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
      organizationShift {
        id
        name
      }
      dateStart
      dateEnd
      timeStart
      timeEnd
    }
  }
`

export const GET_SINGLE_SCHEDULE_SHIFT_ACCOUNTS_QUERY = gql`
  query ScheduleItemAccount($before: String, $after: String, $id: ID!) {
    scheduleItemAccount(id: $id) {
      id
      account {
        id
        fullName
      }
      account2 {
        id
        fullName
      }
      dateStart
      dateEnd       
    }
    accounts(first: 100, before: $before, after: $after, isActive: true, teacher: true) {
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
    accounts(first: 1000, before: $before, after: $after, isActive: true, employee: true) {
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


export const ADD_SCHEDULE_SHIFT_ACCOUNT = gql`
mutation CreateScheduleItemAccount($input:CreateScheduleItemAccountInput!) {
  createScheduleItemAccount(input:$input) {
    scheduleItemAccount {
      id
    } 
  }
}
`


export const UPDATE_SCHEDULE_SHIFT_ACCOUNT = gql`
mutation UpdateScheduleItemAccount($input: UpdateScheduleItemAccountInput!) {
  updateScheduleItemAccount(input:$input) {
    scheduleItemAccount {
      id
    } 
  }
}
`


export const DELETE_SCHEDULE_SHIFT_ACCOUNT = gql`
mutation DeleteScheduleClassTeacher($input: DeleteScheduleItemAccountInput!) {
  deleteScheduleItemAccount(input: $input) {
    ok
  }
}
`