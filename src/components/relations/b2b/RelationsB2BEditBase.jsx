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


function RelationsB2BEditBase({ t, match, history, children, pageTitle="", activeLink="" }) {
  const businessId = match.params.business_id
  const returnUrl = "/relations/b2b"

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={pageTitle}>
            <div className="page-options d-flex">
              <ButtonBack returnUrl={returnUrl} />
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