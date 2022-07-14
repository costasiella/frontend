import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { useQuery } from '@apollo/client'
import DOMPurify from 'dompurify'
import {
  Card, Grid, 
} from "tabler-react";
import ShopContactBase from "./ShopContactBase"

import { GET_ORGANIZATION_QUERY } from "../../organization/organization/queries"


function ShopContact({ t, match, history }) {
  // The ID is fixed, as there's only one organization supported at the moment... easy peasy.
  const { loading, error, data } = useQuery(GET_ORGANIZATION_QUERY, {
    variables: { id: "T3JnYW5pemF0aW9uTm9kZToxMDA="}
  })

  if (loading) return (
    <ShopContactBase>
      {t("general.loading_with_dots")}
    </ShopContactBase>
  )
  if (error) return (
    <ShopContactBase>
      {t("shop.classpasses.error_loading")}
    </ShopContactBase>
  )

  const organization = data.organization

  return (
    <ShopContactBase>
      <Card title={organization.name}>
        <Card.Body>
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(organization.address) }} />
          <p>{organization.email} <br /> {organization.phone}</p>
          <p>{organization.registration} <br /> {organization.taxRegistration}</p>
        </Card.Body>
        <Card.Footer>
          <Grid.Row>
            <Grid.Col xs={12}>
              <a href="/d/export/terms-and-conditions" target="_blank">
                {t("general.terms_and_conditions")}
              </a>
            </Grid.Col>
            <Grid.Col xs={12}>
              <a className="float-sm-right float-md-right float-lg-right float-xl-right" 
                href="/d/export/privacy-policy" target="_blank">
                {t("general.privacy_policy")}
              </a>
            </Grid.Col>
          </Grid.Row>
        </Card.Footer>
      </Card>
    </ShopContactBase>
  )
}


export default withTranslation()(withRouter(ShopContact))
