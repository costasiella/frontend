import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import confirm_archive from '../../tools/confirm_archive'

import {
  Icon
} from "tabler-react"


function ButtonArchive({t, match, history, msgConfirm, msgDescription, msgSuccess, archiveFunction, archiveFunctionVariables}) {
  return (
    <button className="icon btn btn-link btn-sm float-right" 
        title={t('general.archive')} 
        onClick={() => {
          confirm_archive({
              t: t,
              msgConfirm: <p>{msgConfirm}</p>,
              msgDescription: msgDescription,
              msgSuccess: msgSuccess,
              archiveFunction: archiveFunction,
              functionVariables: archiveFunctionVariables
          })
      }}>
      <Icon prefix="fe" name="inbox" />
    </button>
  )
}

export default withTranslation()(withRouter(ButtonArchive))