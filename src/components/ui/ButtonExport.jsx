import React from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from "react-router-dom"

import {
  Button
} from "tabler-react"

function ButtonExport({ t, url, className="", buttonText="" }) {
  if (!buttonText) {
    buttonText = t("general.export")
  }

  return (
    <Link to={url}>
      <Button
        className={className}
        color="primary"
        icon="download-cloud">
          {buttonText}
      </Button>
    </Link>
  )
}

export default withTranslation()(ButtonExport)
