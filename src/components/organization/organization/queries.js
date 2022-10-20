import { gql } from "@apollo/client"


export const GET_ORGANIZATION_QUERY = gql`
  query Organization($id: ID!) {
    organization(id:$id) {
      id
      name
      address
      phone
      email
      registration
      taxRegistration
      urlLogoLogin
      urlLogoInvoice
      urlLogoEmail
      urlLogoShopHeader
      urlLogoSelfCheckin
      brandingColorBackground
      brandingColorText
      brandingColorAccent
      brandingColorSecondary
    }
  }
`

export const UPDATE_ORGANIZATION = gql`
mutation UpdateOrganization($input: UpdateOrganizationInput!) {
  updateOrganization(input: $input) {
    organization {
      id
    }
  }
}
`