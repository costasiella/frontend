import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import ButtonBack from '../../../../ui/ButtonBack'

const AccountEnrollmentBack = ({ t, accountId }) => (
  <ButtonBack returnUrl={ `/relations/accounts/${accountId}/enrollments` } />
)

export default withTranslation()(withRouter(AccountEnrollmentBack))