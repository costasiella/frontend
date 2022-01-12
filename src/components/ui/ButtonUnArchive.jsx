import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import confirm_unarchive from "../../../tools/confirm_unarchive"

import {
  Icon
} from "tabler-react"


function ButtonUnArchive({t, match, history, msgConfirm, msgDescription, msgSuccess, unArchiveFunction, unArchiveFunctionVariables}) {
  return (
    <button className="icon btn btn-link btn-sm float-right" 
        title={t('general.unarchive')} 
        onClick={() => {
          confirm_unarchive({
              t: t,
              msgConfirm: <p>{msgConfirm}</p>,
              msgDescription: msgDescription,
              msgSuccess: msgSuccess,
              unArchiveFunction: unArchiveFunction,
              functionVariables: unArchiveFunctionVariables
          })
      }}>
      <Icon prefix="fe" name="inbox" />
    </button>
  )
}

export default withTranslation()(withRouter(ButtonUnArchive))