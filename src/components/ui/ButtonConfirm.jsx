import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import confirm_action from "../../tools/confirm_action"

// import {
//   Icon
// } from "tabler-react"


function ButtonConfirmAction({
  t, 
  match, 
  history, 
  msgConfirm, 
  msgDescription, 
  msgSuccess, 
  actionFunction, 
  actionFunctionVariables, 
  buttonClass="btn-link",
  buttonIcon="",
  buttonText="",
  buttonTextColor=""
}) {
  return (
    <button className={`icon btn ${buttonClass} btn-sm`}
      // title={t('')} 
      onClick={() => {
        confirm_action({
          t: t,
          msgConfirm: <p>{msgConfirm}</p>,
          msgDescription: msgDescription,
          msgSuccess: msgSuccess,
          actionFunction: actionFunction,
          functionVariables: actionFunctionVariables
        })
    }}>
      <span className={buttonTextColor}>
        {buttonIcon} {buttonText}
      </span>
    </button> 
  )
}


export default withTranslation()(withRouter(ButtonConfirmAction))