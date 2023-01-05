import { gql } from "@apollo/client"

export const UPDATE_CLASS = gql`
mutation UpdateScheduleClass($input:UpdateScheduleClassInput!) {
  updateScheduleClass(input: $input) {
    scheduleItem {
      id
    }
  }
}
`