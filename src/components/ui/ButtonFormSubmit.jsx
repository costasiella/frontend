import React from 'react'
import { withTranslation } from 'react-i18next'

import {
  Button
} from "tabler-react"

const ButtonFormSubmit = ({ t, disabled, className="" }) => (
  <Button
    type="submit"
    disabled={disabled}
    className={`pull-right ${className}`}
    color="primary"
  >
      {t("general.submit")}
  </Button>
)

export default withTranslation()(ButtonFormSubmit)
