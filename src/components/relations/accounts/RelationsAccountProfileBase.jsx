// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Page,
  Grid,
  Card,
  Container
} from "tabler-react"
import SiteWrapper from "../../SiteWrapper"
import HasPermissionWrapper from "../../HasPermissionWrapper"
import ProfileCardSmall from "../../ui/ProfileCardSmall"

import RelationsAccountsBack from "./RelationsAccountsBack"
import ProfileMenu from "./ProfileMenu"

function RelationsAccountProfileBase({t, match, children, headerTitle="", user={}}) {
  const accountId = match.params.account_id

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={headerTitle}>
            <RelationsAccountsBack />
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={9}>
            <Card>
              <Card.Header>
                <Card.Title>{t('relations.accounts.profile')}</Card.Title>
              </Card.Header>
              {children}
            </Card>
            </Grid.Col>                                    
            <Grid.Col md={3}>
              <ProfileCardSmall user={user}/>
              <ProfileMenu 
                activeLink='profile'
                accountId={accountId}
              /> 
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>
  )
}

export default withTranslation()(withRouter(RelationsAccountProfileBase))