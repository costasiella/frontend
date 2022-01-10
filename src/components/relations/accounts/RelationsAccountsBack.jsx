import React from 'react'
import { withTranslation } from 'react-i18next'

import ButtonBack from '../../ui/ButtonBack'

const RelationsAccountsBack = ({ t }) => (
  <div className="page-options d-flex">
    <ButtonBack returnUrl="/relations/accounts" />
  </div>
)

export default withTranslation()(RelationsAccountsBack)