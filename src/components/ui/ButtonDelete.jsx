import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import confirm_delete from "../../tools/confirm_delete"

import {
  Icon
} from "tabler-react"


function ButtonDelete({
  t, 
  match, 
  history, 
  msgConfirm, 
  msgDescription, 
  msgSuccess, 
  deleteFunction, 
  deleteFunctionVariables, 
  buttonClass="btn-link",
  buttonText="",
  buttonTextColor="text-red"
}) {
  return (
    <button className={`icon btn ${buttonClass} btn-sm`}
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
      <span className={buttonTextColor}>
        <Icon prefix="fe" name="trash-2" /> {buttonText}
      </span>
    </button> 
  )
}


export default withTranslation()(withRouter(ButtonDelete))