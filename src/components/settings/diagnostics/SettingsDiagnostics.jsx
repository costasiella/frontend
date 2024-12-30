import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Card,
} from "tabler-react";

import SettingsBase from "../SettingsBase"


function getLocalStorageValuesAsObject() {
  let objLSItems = {}
  const keys = Object.keys(localStorage)
  let i = keys.length

  while ( i-- ) {
    objLSItems[ keys[i] ] = localStorage.getItem( keys[i] );
  }

  return objLSItems;
}


function SettingsDiagnostics({ t, match, history }) {
  const headerSubTitle = t('settings.about.diagnostics.title')
  const objLSItems = getLocalStorageValuesAsObject()
    
  return (
    <SettingsBase 
      headerSubTitle={headerSubTitle}
      cardTitle={t("settings.about.diagnostics.browser_local_storage")}
    >
      <Card.Body>
        {
          Object.entries(objLSItems).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {value}
            </div>
          ))
        }
      </Card.Body>
    </SettingsBase>
  )
}


export default withTranslation()(withRouter(SettingsDiagnostics))