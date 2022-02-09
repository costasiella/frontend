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

import ButtonBack from '../../ui/ButtonBack'
import ProfileMenu from "./ProfileMenu"

function RelationsAccountProfileBase({t, match, children, back, returnUrl='/relations/accounts', pageHeaderButtonList="", activeLink="", user={}}) {
  const accountId = match.params.account_id
  let headerTitle = ""
  if (user) {
    headerTitle = `${user.firstName} ${user.lastName}`
  }

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={headerTitle}>
            <div className="page-options d-flex">
              {(back) ? back : <ButtonBack returnUrl={returnUrl} />}
              {pageHeaderButtonList}
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={9}>
              {children}
            </Grid.Col>                                    
            <Grid.Col md={3}>
              <ProfileCardSmall user={user}/>
              <ProfileMenu 
                activeLink={activeLink}
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