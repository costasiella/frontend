import React from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from "react-router-dom"

import {
  Button
} from "tabler-react"

const ButtonEdit = ({ t, editUrl, className="" }) => (
  <Link to={editUrl}>
    <Button
      className={`btn-sm ${className}`}
      color="secondary"
    >
        {t("general.edit")}
    </Button>
  </Link>
)

export default withTranslation()(ButtonEdit)
