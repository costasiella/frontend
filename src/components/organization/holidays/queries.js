import { gql } from "@apollo/client"

export const GET_HOLIDAYS_QUERY = gql`
  query OrganizationHolidays($after: String, $before: String) {
    organizationHolidays(first: 15, before: $before, after: $after) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          name
          description
          dateStart
          dateEnd
          classes
          organizationLocations {
            edges {
              node {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`

export const GET_HOLIDAY_QUERY = gql`
  query OrganizationHoliday($id: ID!) {
    organizationHoliday(id:$id) {
      id
      name
      description
      dateStart
      dateEnd
      classes
    }
  }
`

export const ADD_HOLIDAY = gql`
mutation CreateOrganizationHoliday($input:CreateOrganizationHolidayInput!) {
  createOrganizationHoliday(input: $input) {
    organizationHoliday {
      id
    }
  }
}
`

export const UPDATE_HOLIDAY = gql`
mutation UpdateOrganizationHoliday($input: UpdateOrganizationHolidayInput!) {
  updateOrganizationHoliday(input: $input) {
    organizationHoliday {
      id
      name
    }
  }
}
`

export const DELETE_HOLIDAY = gql`
mutation DeleteOrganizationHoliday($input: DeleteOrganizationHolidayInput!) {
  deleteOrganizationHoliday(input: $input) {
    ok
  }
}
`