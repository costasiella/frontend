import { gql } from "@apollo/client"

export const GET_ACCOUNT = gql`
  query Account($accountId: ID!){
    account(id:$accountId) {
      id
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
