import { gql } from "@apollo/client"

export const UPDATE_SHIFT = gql`
mutation UpdateScheduleShift($input:UpdateScheduleShiftInput!) {
  updateScheduleShift(input: $input) {
    scheduleItem {
      id
    }
  }
}
`