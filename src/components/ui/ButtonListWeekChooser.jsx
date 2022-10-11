import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Button,
} from "tabler-react"

function ButtonListWeekChooser({ t, onClickPrevious=f=>f, onClickNext=f=>f, onClickCurrent=f=>f}) {
  return (
    <Button.List className="schedule-list-page-options-btn-list">
      <Button 
        icon="chevron-left"
        color="secondary"
        onClick={ onClickPrevious }
      />
      <Button 
        icon="sunset"
        color="secondary"
        onClick={ onClickCurrent }
      />
      <Button 
        icon="chevron-right"
        color="secondary"
        onClick={ onClickNext }
      />
    </Button.List> 
  )
}

export default withTranslation()(withRouter(ButtonListWeekChooser))