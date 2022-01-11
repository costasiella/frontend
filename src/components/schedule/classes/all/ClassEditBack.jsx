import React from 'react'
import { withTranslation } from 'react-i18next'

import ButtonBack from '../../../ui/ButtonBack'

const ClassEditBack = ({ t }) => (
  <ButtonBack returnUrl="/schedule/classes" />
)

export default withTranslation()(ClassEditBack)