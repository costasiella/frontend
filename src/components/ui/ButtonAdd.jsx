import React from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from "react-router-dom"

import {
  Button
} from "tabler-react"

const ButtonAdd = ({ t, addUrl, className="" }) => (
  <Link to={addUrl}>
    <Button
      className={className}
      color="primary"
      icon="plus-circle">
        {t("general.add")}
    </Button>
  </Link>
)

export default withTranslation()(ButtonAdd)
