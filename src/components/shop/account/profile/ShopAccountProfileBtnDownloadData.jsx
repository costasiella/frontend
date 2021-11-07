import React from 'react'
import { useMutation } from '@apollo/client'
import { withTranslation } from 'react-i18next'

import { TOKEN_REFRESH } from "../../../../queries/system/auth"
import { refreshTokenAndOpenExportLinkInNewTab } from "../../../../tools/refresh_token_and_open_export_link"

import {
  Button,
} from "tabler-react";


function ShopAccountProfileBtnDownloadData({ t, history }) {
  const export_url = "/d/export/account_data"
  const [doTokenRefresh] = useMutation(TOKEN_REFRESH)

  //TODO Check if account data download feature is enabled

  return (
    <Button
      color="secondary"
      icon="download"
      className="ml-2"
      onClick={() => refreshTokenAndOpenExportLinkInNewTab(
        doTokenRefresh, history, export_url
      )}
    >
      {t('shop.account.profile.download_my_data')} 
    </Button>
  )
}

export default withTranslation()(ShopAccountProfileBtnDownloadData)
