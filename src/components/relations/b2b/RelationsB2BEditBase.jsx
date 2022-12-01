import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Page,
  Grid,
  Container
} from "tabler-react"

import SiteWrapper from "../../SiteWrapper"
import ButtonBack from '../../ui/ButtonBack'
import RelationsB2BEditMenu from './RelationsB2BEditMenu'


function RelationsB2BEditBase({ 
  t, match, history, children, pageTitle="", activeLink="", returnUrl="/relations/b2b", pageHeaderButtonList="" 
}) {
  const businessId = match.params.business_id
  const titleB2B = t("relations.b2b.title")

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={`${titleB2B} - ${pageTitle}`}>
            <div className="page-options d-flex">
              <ButtonBack returnUrl={returnUrl} />
              { pageHeaderButtonList }
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={9}>
              {children}
            </Grid.Col> 
            <Grid.Col md={3}>
              <RelationsB2BEditMenu businessId={businessId} activeLink={activeLink} />
            </Grid.Col>                               
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>
  )
}

export default withTranslation()(withRouter(RelationsB2BEditBase))