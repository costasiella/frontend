import React from 'react'
import { withTranslation } from 'react-i18next'

import ButtonBack from '../../ui/ButtonBack'

const RelationsAccountsBack = ({ t }) => (
    <ButtonBack returnUrl="/relations/accounts" />
)

export default withTranslation()(RelationsAccountsBack)