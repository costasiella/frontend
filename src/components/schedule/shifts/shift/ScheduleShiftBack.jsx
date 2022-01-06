import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import ButtonBack from '../../../ui/ButtonBack'


const ScheduleShiftBack = ({ t, classId }) => (
  <ButtonBack returnUrl={"/schedule/shifts"} />
)

export default withTranslation()(withRouter(ScheduleShiftBack))