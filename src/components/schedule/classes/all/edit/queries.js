import { gql } from "@apollo/client"

export const UPDATE_CLASS = gql`
mutation UpdateScheduleClass($input:UpdateScheduleClassInput!) {
  updateScheduleClass(input: $input) {
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
}
`