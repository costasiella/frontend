import React from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from "react-router-dom"

import {
  Button
} from "tabler-react"

const ButtonFormCancel = ({ t, returnUrl, className="" }) => (
  <Link to={returnUrl}>
    <Button
      role="button"
      className={className}
      color="link"
    >
        {t("general.cancel")}
    </Button>
  </Link>
)

export default withTranslation()(ButtonFormCancel)
