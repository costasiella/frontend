import { gql } from "@apollo/client"


export const GET_ACCOUNT_INSTRUCTOR_PROFILE_QUERY = gql`
  query AccountInstructorProfileQuery($id: ID!) {
    accountInstructorProfiles(account:$id) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        node {
          account {
            id
          }
          classes
          appointments
          events
          role
          education
          bio
          urlBio
          urlWebsite   
        }
      }
    }
    account(id:$id) {
      id
      instructor
      firstName
      lastName
      email
      phone
      mobile
      isActive
      urlImageThumbnailSmall
    }
  }
`


export const UPDATE_ACCOUNT_INSTRUCTOR_PROFILE = gql`
  mutation UpdateAccountInstructorProfile($input:UpdateAccountInstructorProfileInput!) {
    updateAccountInstructorProfile(input: $input) {
      accountInstructorProfile {
        id
      }
    }
  }
`

