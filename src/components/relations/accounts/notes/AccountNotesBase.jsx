// @flow

import React from 'react'
import { useQuery } from "@apollo/client"
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
import ButtonAdd from '../../../ui/ButtonAdd'
import ButtonBack from '../../../ui/ButtonBack'
import { GET_ACCOUNT_QUERY } from '../queries'


function AccountNotesBase({ t, history, match, children, showEditBack=false }) {
  const accountId = match.params.account_id

  const { loading, error, data } = useQuery(GET_ACCOUNT_QUERY, {
    variables: { id: accountId }
  })

  if (loading) return <p>{t('general.loading_with_dots')}</p>
  // Error
  if (error) {
    console.log(error)
    return <p>{t('general.error_sad_smiley')}</p>
  }

  const account = data.account

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={account.firstName + " " + account.lastName}>
            <div className='page-options d-flex'>
              {(showEditBack) ?
                <ButtonBack returnUrl={`/relations/accounts/${accountId}/notes/`} />
              :
                <React.Fragment>
                  <RelationsAccountsBack />
                  <ButtonAdd addUrl={`/relations/accounts/${accountId}/notes/add`} className='ml-2' />
                </React.Fragment>
              }
            </div>
          </Page.Header>
          <Grid.Row>
            <Grid.Col md={9}>
              {children}
            </Grid.Col>
            <Grid.Col md={3}>
              <ProfileCardSmall user={account}/>
              <ProfileMenu 
                activeLink='notes'
                accountId={accountId}
              /> 
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>
  )
}    
        
export default withTranslation()(withRouter(AccountNotesBase))