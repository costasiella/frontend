import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Page,
  Grid,
  Container,
} from "tabler-react";
import SiteWrapper from "../../../SiteWrapper"

import ProfileMenu from "../ProfileMenu"
import ProfileCardSmall from "../../../ui/ProfileCardSmall"

function AccountInvoicesBase({ t, match, history, children, account={}, pageHeaderButtonList="" }) {
  const accountId = match.params.account_id
  let pageHeader
  if (account) {
    pageHeader = account.fullName
  }

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={pageHeader} >
            <div className='page-options d-flex'>
              { pageHeaderButtonList }
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={9}>
              {children}
            </Grid.Col>
            <Grid.Col md={3}>
              <ProfileCardSmall user={account}/>

              <ProfileMenu 
                activeLink='invoices' 
                accountId={accountId}
              />
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>
  )
}


export default withTranslation()(withRouter(AccountInvoicesBase))
