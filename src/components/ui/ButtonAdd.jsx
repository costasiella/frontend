import React from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from "react-router-dom"

import {
  Button
} from "tabler-react"

function ButtonAdd({ t, addUrl, className="", buttonText="" }) {
  if (!buttonText) {
    buttonText = t("general.add")
  }

  return (
    <Link to={addUrl}>
      <Button
        className={className}
        color="primary"
        icon="plus-circle">
          {buttonText}
      </Button>
    </Link>
  )
}

export default withTranslation()(ButtonAdd)
