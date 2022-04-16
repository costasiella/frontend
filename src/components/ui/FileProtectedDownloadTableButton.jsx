// @flow

import React from 'react'
import { useMutation } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Button
} from "tabler-react";

import { TOKEN_REFRESH } from "../../queries/system/auth"
import { refreshTokenAndOpenExportLinkInNewTab } from "../../tools/refresh_token_and_open_export_link"


function FileProtectedDownloadTableButton({ t, history, protectedMediaUrl, className="" }) {
  const [doTokenRefresh] = useMutation(TOKEN_REFRESH)

  return (
    <Button 
      color={"secondary " + className}
      size="sm"
      icon="download-cloud"
      RootComponent="a" 
      onClick={() => refreshTokenAndOpenExportLinkInNewTab(
        t, doTokenRefresh, history, protectedMediaUrl
    )}
    >
      {t('general.download')}
    </Button>
  )
}

export default withTranslation()(withRouter(FileProtectedDownloadTableButton))



