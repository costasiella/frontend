import React from 'react'
import { useQuery } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Dimmer } from 'tabler-react';

import { GET_ACCOUNT } from '../../../../queries/accounts/get_account'

import SearchClassesOnDate from '../../../ui/SearchClassesOnDate'
import AccountEnrollmentsBase from "./AccountEnrollmentsBase"
import AccountEnrollmentBack from './AccountEnrollmentBack'

function AccountEnrollmentFindClass({ t, match, location }) {
  const accountId = match.params.account_id
  const pageHeaderButtonList = <AccountEnrollmentBack accountId={accountId} />
  const { loading, error, data } = useQuery(GET_ACCOUNT, { variables: { accountId: accountId }})

  if (loading) { 
    return (
      <AccountEnrollmentsBase pageHeaderButtonList={pageHeaderButtonList} >
        <Dimmer active={true} loader={true} />
      </AccountEnrollmentsBase>
    )
  }

  if (error) { 
    return (
      <AccountEnrollmentsBase pageHeaderButtonList={pageHeaderButtonList} >
        <p>{t('general.error_sad_smiley')}</p>
      </AccountEnrollmentsBase>
    )
  }

  const account = data.account

  return (
    <AccountEnrollmentsBase account={account} pageHeaderButtonList={pageHeaderButtonList} >
      <h5>{t('relations.account.enrollments.title_add_search_class')}</h5>
      <SearchClassesOnDate btnAction="accountEnrollmentAdd" />
    </AccountEnrollmentsBase>
  )
}


export default withTranslation()(withRouter(AccountEnrollmentFindClass))
