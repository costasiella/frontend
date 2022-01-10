import React from 'react'
import { withTranslation } from 'react-i18next'

import ButtonBack from '../../../ui/ButtonBack';

const ShiftEditBack = ({ t }) => (
    <ButtonBack returnUrl="/schedule/shifts" />
)

export default withTranslation()(ShiftEditBack)