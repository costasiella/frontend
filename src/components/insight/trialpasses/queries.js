import { gql } from "@apollo/client"


export const GET_TRIALPASSES_QUERY = gql`
  query AccountClasspasses($dateStartFrom: Date!, $dateStartUntil: Date!) {
    accountClasspasses(first:100, organizationClasspass_TrialPass: true, dateStart_Gte: $dateStartFrom, dateStart_Lte:$dateStartUntil), {
      edges {
        node {
          id
          dateStart
          dateEnd
          account {
            id
            fullName
            classpasses(organizationClasspass_TrialPass: false) {
              edges {
                node {
                  id
                  dateStart
                  organizationClasspass{
                    name
                  }
                }
              }
            }
            subscriptions {
              edges {
                node {
                  dateStart
                  organizationSubscription {
                    name
                  }
                }
              }
            }
          }
          organizationClasspass {
            name
          }
        }
      }
    }
  }
`

