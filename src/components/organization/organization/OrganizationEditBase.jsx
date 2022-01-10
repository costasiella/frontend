// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"


import {
  Page,
  Grid,
  Button,
  Card,
  Container
} from "tabler-react";
import SiteWrapper from "../../SiteWrapper"
import HasPermissionWrapper from "../../HasPermissionWrapper"



function OrganizationEditBase({t, match, history, children}) {
  const id = match.params.id

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={t('organization.title')}>
            <div className="page-options d-flex">
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={12}>
            <Card>
              <Card.Header>
                <Card.Title>{t('organization.organization.title_edit')}</Card.Title>
              </Card.Header>
              {children}
            </Card>
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>
  )
}


export default withTranslation()(withRouter(OrganizationEditBase))