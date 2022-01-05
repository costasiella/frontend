import React from 'react'
import { withTranslation } from 'react-i18next'

import ButtonBack from '../../../ui/ButtonBack';

const ShiftEditBack = ({ t }) => (
  <div className="page-options d-flex">
    <ButtonBack returnUrl="/schedule/shifts" />
  </div>
)

export default withTranslation()(ShiftEditBack)