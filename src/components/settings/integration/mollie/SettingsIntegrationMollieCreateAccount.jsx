// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Alert,
  Button,
  Header,
  Icon
} from "tabler-react";


function SettingsIntegrationMollieCreateAccount({ t, match, history, mollieApiKey }) {
  // if (!mollieApiKey) {
  //   return ""
  // }

  return (
    <Alert type="primary">
      <Header.H4>{t('settings.integration.mollie.create_account_title')}</Header.H4>
      <p>
        {t("settings.integration.mollie.create_account_message")}
      </p>
      <a href="https://www.mollie.com/dashboard/signup/2488481" target="_blank">
        <Button color="success" RootComponent="button">
          {t("settings.integration.mollie.to_mollie")} <Icon name="chevron-right" />
        </Button>
      </a>
    </Alert>
  )
}


export default withTranslation()(withRouter(SettingsIntegrationMollieCreateAccount))