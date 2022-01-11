import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import ButtonBack from '../../../../ui/ButtonBack'


const ScheduleClassPriceBack = ({ t, classId }) => (
  <ButtonBack returnUrl={`/schedule/classes/all/prices/${classId}`} />
)

export default withTranslation()(withRouter(ScheduleClassPriceBack))