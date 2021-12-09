import { gql } from "@apollo/client"


export const GET_TRIALPASSES_QUERY = gql`
  query AccountClasspasses($dateStart: Date!, $dateEnd: Date!) {
    accountClasspasses(organizationClasspass_TrialPass: true, dateStart_Gte: $dateStart, dateStart_Lte:$dateEnd), {
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

