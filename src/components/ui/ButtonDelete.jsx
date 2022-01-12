import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import confirm_delete from "../../tools/confirm_delete"

import {
  Icon
} from "tabler-react"


function ButtonDelete({t, match, history, msgConfirm, msgDescription, msgSuccess, deleteFunction, deleteFunctionVariables}) {
  return (
    <button className="icon btn btn-link btn-sm"
      title={t('general.delete')} 
      onClick={() => {
        confirm_delete({
          t: t,
          msgConfirm: <p>{msgConfirm}</p>,
          msgDescription: msgDescription,
          msgSuccess: msgSuccess,
          deleteFunction: deleteFunction,
          functionVariables: deleteFunctionVariables
        })
    }}>
      <span className="text-red">
        <Icon prefix="fe" name="trash-2" />
      </span>
    </button> 
  )
}


export default withTranslation()(withRouter(ButtonDelete))