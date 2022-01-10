import { gql } from "@apollo/client"

export const GET_CLASSPASSES_QUERY = gql`
  query OrganizationClasspasses($after: String, $before: String, $archived: Boolean) {
    organizationClasspasses(first: 15, before: $before, after: $after, archived: $archived) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          archived
          displayPublic
          displayShop
          trialPass
          name
          description
          price
          priceDisplay
          financeTaxRate {
            id
            name
          }
          validity
          validityUnit
          validityUnitDisplay
          classes
          unlimited
          quickStatsAmount
          financeGlaccount {
            id 
            name
          }
          financeCostcenter {
            id
            name
          }
        }
      }
    }
  }
`

export const GET_CLASSPASS_QUERY = gql`
  query OrganizationClasspass($id: ID!, $after: String, $before: String) {
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
      financeTaxRate {
        id
        name
      }
      validity
      validityUnit
      validityUnitDisplay
      classes
      unlimited
      quickStatsAmount
      financeGlaccount {
        id 
        name
      }
      financeCostcenter {
        id
        name
      }
    }
    financeTaxRates(first: 15, before: $before, after: $after, archived: false) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          archived
          name
          percentage
          rateType
        }
      }
    }
    financeGlaccounts(first: 15, before: $before, after: $after, archived: false) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          archived
          name
          code
        }
      }
    }
    financeCostcenters(first: 15, before: $before, after: $after, archived: false) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          archived
          name
          code
        }
      }
    }
  }
`

export const GET_INPUT_VALUES_QUERY = gql`
  query InputValues($after: String, $before: String) {
    financeTaxRates(first: 15, before: $before, after: $after, archived: false) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          archived
          name
          percentage
          rateType
        }
      }
    }
    financeGlaccounts(first: 15, before: $before, after: $after, archived: false) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          archived
          name
          code
        }
      }
    }
    financeCostcenters(first: 15, before: $before, after: $after, archived: false) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      edges {
        node {
          id
          archived
          name
          code
        }
      }
    }
  }
`

export const CREATE_CLASSPASS = gql`
mutation CreateClasspass($input: CreateOrganizationClasspassInput!) {
  createOrganizationClasspass(input: $input) {
    organizationClasspass {
      id
    }
  }
}
`

export const UPDATE_CLASSPASS = gql`
  mutation UpdateOrganizationClasspass($input: UpdateOrganizationClasspassInput!) {
    updateOrganizationClasspass(input: $input) {
      organizationClasspass {
        id
      }
    }
  }
`

export const ARCHIVE_CLASSPASS = gql`
mutation ArchiveOrganizationClasspass($input: ArchiveOrganizationClasspassInput!) {
  archiveOrganizationClasspass(input: $input) {
    organizationClasspass {
      id
      archived
    }
  }
}
`
