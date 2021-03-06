import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Page,
  Grid,
  Container
} from "tabler-react";
import SiteWrapper from "../../../SiteWrapper"
import RelationsAccountsBack from "../RelationsAccountsBack"

import ProfileMenu from "../ProfileMenu"
import ProfileCardSmall from "../../../ui/ProfileCardSmall"


function AccountClassesBase({ t, match, history, children, account={} }) {
  const accountId = match.params.account_id

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={account.fullName} >
            <div className="page-options d-flex">
              <RelationsAccountsBack />
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={9}>
              {children}
            </Grid.Col>
            <Grid.Col md={3}>
              <ProfileCardSmall user={account}/>
              <ProfileMenu 
                activeLink='classes' 
                accountId={accountId}
              />
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>
  )
}

export default withTranslation()(withRouter(AccountClassesBase))