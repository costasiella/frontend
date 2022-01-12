import React from 'react'
import { useQuery } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"


import {
  Page,
  Grid,
  Container,
} from "tabler-react";
import SiteWrapper from "../../../SiteWrapper"

import RelationsAccountsBack from "../RelationsAccountsBack"

import ProfileMenu from "../ProfileMenu"
import ProfileCardSmall from "../../../ui/ProfileCardSmall"
import { GET_ACCOUNT } from "../../../../queries/accounts/get_account"


function AccountScheduleEventTicketsBase({t, history, match, children}) {
  const accountId = match.params.account_id
  const { loading, error, data } = useQuery(GET_ACCOUNT, { variables: {
    accountId: accountId
  }})

  if (loading) return (
    <p>
      {t("general.loading_with_dots")}
    </p>
  )
  if (error) return (
    <p>
      {t("relations.account.error_loading")}
    </p>
  )

  console.log(data)
  const account = data.account
  console.log(account)

  return (
    <SiteWrapper>
      <div className="my-3 my-md-5">
        <Container>
          <Page.Header title={account.firstName + " " + account.lastName} >
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
              {/* <HasPermissionWrapper permission="add"
                                    resource="accountclasspass">
                <Link to={"/relations/accounts/" + match.params.account_id + "/classpasses/add"}>
                  <Button color="primary btn-block mb-6">
                    <Icon prefix="fe" name="plus-circle" /> {t('relations.account.classpasses.add')}
                  </Button>
                </Link>
              </HasPermissionWrapper> */}
              <ProfileMenu 
                activeLink='tickets' 
                accountId={accountId}
              />
            </Grid.Col>
          </Grid.Row>
        </Container>
      </div>
    </SiteWrapper>
  )
}


export default withTranslation()(withRouter(AccountScheduleEventTicketsBase))