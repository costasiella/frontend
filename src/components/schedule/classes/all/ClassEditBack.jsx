import React from 'react'
import { withTranslation } from 'react-i18next'

import ButtonBack from '../../../ui/ButtonBack'

const ClassEditBack = ({ t, className }) => (
  <ButtonBack returnUrl="/schedule/classes" className={className} />
)

export default withTranslation()(ClassEditBack)