import React from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from "react-router-dom"

import {
  Button
} from "tabler-react"

const ButtonBack = ({ t, returnUrl, className="" }) => (
  <Link to={returnUrl}>
    <Button
      className={className}
      color="secondary"
      icon="arrow-left">
        {t("general.back")}
    </Button>
  </Link>
)

export default withTranslation()(ButtonBack)
