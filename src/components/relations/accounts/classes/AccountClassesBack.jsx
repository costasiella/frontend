import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import ButtonBack from '../../../ui/ButtonBack'

const AccountClassesBack = ({ t, accountId }) => (
  <ButtonBack returnUrl={ `/relations/accounts/${accountId}/classes` } />
)

export default withTranslation()(withRouter(AccountClassesBack))