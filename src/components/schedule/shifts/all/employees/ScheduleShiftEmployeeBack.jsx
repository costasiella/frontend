import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import ButtonBack from '../../../../ui/ButtonBack'

const ScheduleClassTeacherBack = ({ t, shiftId }) => (
  <ButtonBack returnUrl={"/schedule/shifts/all/employees/" + shiftId} />
)

export default withTranslation()(withRouter(ScheduleClassTeacherBack))