import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import ButtonBack from '../../../ui/ButtonBack'


const ScheduleClassBack = ({ t, classId }) => (
  <ButtonBack className="mr-2" returnUrl="/schedule/classes" />
)

export default withTranslation()(withRouter(ScheduleClassBack))