import { gql } from "@apollo/client"

export const GET_LOCATION_CLASSES_QUERY = gql`
  query ScheduleClasses(
      $dateFrom: Date!, 
      $dateUntil:Date!, 
      $orderBy: String, 
      $organizationClasstype: ID,
      $organizationLevel: ID,
      $organizationLocation: ID!,
    ){
    scheduleClasses(
        dateFrom:$dateFrom, 
        dateUntil: $dateUntil, 
        orderBy: $orderBy, 
        organizationClasstype: $organizationClasstype,
        organizationLevel: $organizationLevel,
        organizationLocation: $organizationLocation,
    ){
      date
      classes {
        scheduleItemId
        frequencyType
        date
        status
        description
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
        timeStart
        timeEnd
        displayPublic
      }
    }
    organizationLocation(id: $organizationLocation) {
      id
      name
    }
  }
`