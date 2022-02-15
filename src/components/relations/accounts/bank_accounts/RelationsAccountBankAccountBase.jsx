import React from 'react'
import { useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { GET_ACCOUNT_QUERY } from '../queries'

import {
  Page,
  Grid,
  Container
} from "tabler-react"
import SiteWrapper from "../../../SiteWrapper"
import HasPermissionWrapper from "../../../HasPermissionWrapper"
import ButtonAdd from '../../../ui/ButtonAdd';
import ButtonBack from '../../../ui/ButtonBack';
import ProfileCardSmall from "../../../ui/ProfileCardSmall"
import RelationsAccountsBack from "../RelationsAccountsBack"
import ProfileMenu from "../ProfileMenu"


function RelationsAccountBankAccountBase({ t, match, history, children, bankAccountId="", pageHeaderButtonList, showEditBack=false }) {
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
                <ButtonBack returnUrl={`/relations/accounts/${accountId}/bank_accounts/`} /> :
                <RelationsAccountsBack />  
              }
              {pageHeaderButtonList}
              {((bankAccountId) && !(showEditBack)) ?
                <HasPermissionWrapper permission="add"
                                      resource="accountbankaccountmandate">
                  <ButtonAdd 
                    addUrl={`/relations/accounts/${match.params.account_id}/bank_accounts/${bankAccountId}/mandates/add`}
                    buttonText={t('relations.account.bank_accounts.mandates.add')}
                    className="ml-2"
                  />
                </HasPermissionWrapper>
                : "" 
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
                activeLink='bank_account'
                accountId={accountId}
              /> 
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>
  )
}


export default withTranslation()(withRouter(RelationsAccountBankAccountBase))