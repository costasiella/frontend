import { gql } from "@apollo/client"

export const GET_SHIFTS_QUERY = gql`
query ScheduleShifts(
  $dateFrom: Date!, 
  $dateUntil:Date!, 
  $orderBy: String, 
  $organizationShift: ID,
  $organizationLocation: ID,
){
  scheduleShifts(
      dateFrom:$dateFrom, 
      dateUntil: $dateUntil, 
      orderBy: $orderBy, 
      organizationShift: $organizationShift,
      organizationLocation: $organizationLocation,
  ){
    date
    shifts {
      scheduleItemId
      frequencyType
      date
      status
      description
      holiday
      holidayName
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
      timeStart
      timeEnd
    }
    organizationLocations(first: 100, archived: false) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          archived
          name
        }
      }
    }
    organizationShifts(first: 100, archived: false) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          archived
          name
        }
      }
    }
  }
`

export const GET_SHIFT_QUERY = gql`
  query ScheduleShift($scheduleItemId: ID!, $date: Date!) {
    scheduleShift(scheduleItemId:$scheduleItemId, date: $date) {
      scheduleItemId
      frequencyType
      organizationLocationRoom {
        id
        name
      }
      organizationShift {
        id
        name
      }
      timeStart
      timeEnd
    }
    organizationLocationRooms(first: 100, before: $before, after: $after, archived: false) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          archived
          name
          organizationLocation {
            id
            name
          }
        }
      }
    }
    organizationShifts(first: 100, before: $before, after: $after, archived: false) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          archived
          name
        }
      }
    }
  }
`

export const GET_INPUT_VALUES_QUERY = gql`
  query ScheduleShiftInputValues($after: String, $before: String) {
    organizationLocationRooms(first: 100, before: $before, after: $after, archived: false) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          archived
          name
          organizationLocation {
            id
            name
          }
        }
      }
    }
    organizationShifts(first: 100, before: $before, after: $after, archived: false) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          archived
          name
        }
      }
    }
  }
`

export const CREATE_SHIFT = gql`
  mutation CreateScheduleShift($input:CreateScheduleShiftInput!) {
    createScheduleShift(input: $input) {
      scheduleItem {
        id
        scheduleItemType
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
  }
`


export const DELETE_SCHEDULE_SHIFT = gql`
  mutation DeleteScheduleShift($input: DeleteScheduleShiftInput!) {
    deleteScheduleShift(input: $input) {
      ok
    }
  }
`