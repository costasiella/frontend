import React from 'react'
import { useQuery } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Dimmer } from 'tabler-react';

import { GET_ACCOUNT } from '../../../../queries/accounts/get_account'

import SearchClassesOnDate from '../../../ui/SearchClassesOnDate'
import AccountClassesBase from "./AccountClassesBase"
import AccountClassesBack from './AccountClassesBack'

function AccountClassesFindClass({ t, match, location }) {
  const accountId = match.params.account_id
  const pageHeaderButtonList = <AccountClassesBack accountId={accountId} />
  const { loading, error, data } = useQuery(GET_ACCOUNT, { variables: { accountId: accountId }})

  if (loading) { 
    return (
      <AccountClassesBase pageHeaderButtonList={pageHeaderButtonList} >
        <Dimmer active={true} loader={true} />
      </AccountClassesBase>
    )
  }

  if (error) { 
    return (
      <AccountClassesBase pageHeaderButtonList={pageHeaderButtonList} >
        <p>{t('general.error_sad_smiley')}</p>
      </AccountClassesBase>
    )
  }

  const account = data.account

  return (
    <AccountClassesBase account={account} pageHeaderButtonList={pageHeaderButtonList} >
      <h5>{t('relations.account.classes.title_add_search_class')}</h5>
      <SearchClassesOnDate btnAction="accountAttendanceAdd" />
    </AccountClassesBase>
  )
}


export default withTranslation()(withRouter(AccountClassesFindClass))
