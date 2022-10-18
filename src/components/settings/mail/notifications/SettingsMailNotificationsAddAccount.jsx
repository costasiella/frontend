import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import SettingsMailNotificationsBase from './SettingsMailNotificationsBase'
import SearchAccounts from '../../../ui/SearchAccounts'


function SettingsMailNotificationsAddAccount({ t, match, history }) {

  return (
    <SettingsMailNotificationsBase showBack={true}>
      <SearchAccounts
        localStorateKeySearchValue="" 
        placeholderSearch={t("settings.mail.notifications.placeholder_search_account")} 
        btnDisableAccountIds={[1]}
        btnDisabledMessage="already notified!"
        btnAction="settingsMailNotificationAddAccount"
      />
    </SettingsMailNotificationsBase>
  ) 
}


export default withTranslation()(withRouter(SettingsMailNotificationsAddAccount))
