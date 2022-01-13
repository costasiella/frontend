import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import {
  Page,
  Grid,
  Icon,
  Button,
  Container,
} from "tabler-react";
import SiteWrapper from "../../../SiteWrapper"
import HasPermissionWrapper from "../../../HasPermissionWrapper"

import RelationsAccountsBack from "../RelationsAccountsBack"

import ProfileMenu from "../ProfileMenu"
import ProfileCardSmall from "../../../ui/ProfileCardSmall"

function AccountInvoicesBase({ t, match, history, children, account={} }) {
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
              <RelationsAccountsBack />
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={9}>
              {children}
            </Grid.Col>
            <Grid.Col md={3}>
              <ProfileCardSmall user={account}/>
                <HasPermissionWrapper permission="add"
                                      resource="financeinvoice">
                  <Link to={`/relations/accounts/${accountId}/invoices/add`}>
                    <Button color="primary btn-block mb-6">
                      <Icon prefix="fe" name="plus-circle" /> {t('relations.account.invoices.add')}
                    </Button>
                  </Link>
                </HasPermissionWrapper>
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
