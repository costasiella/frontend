import React from 'react'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import {
  Button,
  Card,
  Dimmer,
  Table
} from "tabler-react";

// import ButtonAdd from "../../../ui/ButtonAdd"
import ContentCard from "../../../general/ContentCard"

import { GET_NOTIFICATIONS_QUERY } from "./queries"
import SettingsMailNotificationsBase from './SettingsMailNotificationsBase'
import SearchAccounts from '../../../ui/SearchAccounts'


function SettingsMailNotificationsAddAccount({ t, match, history }) {
  const notificationID = match.params.id
  const cardTitle = t('settings.mail.notifications.title_add_account')

  return (
    <SettingsMailNotificationsBase>
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
