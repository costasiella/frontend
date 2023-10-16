import { gql } from "@apollo/client"


export const GET_CLASSPASS_QUERY = gql`
  query OrganizationClasspass($id: ID!) {
    organizationClasspass(id:$id) {
      id
      archived
      displayPublic
      displayShop
      trialPass
      name
      description
      price
      priceDisplay
      validity
      validityUnit
      validityUnitDisplay
      classes
      unlimited
      quickStatsAmount
    }
    user {
      hasReachedTrialLimit
    }
  }
`
