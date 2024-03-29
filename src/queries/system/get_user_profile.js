import { gql } from "@apollo/client"

const GET_USER_PROFILE = gql`
  query User {
    user {
      id
      accountId
      firstName
      lastName
      fullName
      email
      gender
      dateOfBirth
      address
      postcode
      city
      country
      phone
      mobile
      emergency
      instructor
      employee
      profilePolicy
    }
  }
`

export default GET_USER_PROFILE