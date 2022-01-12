import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import ButtonBack from '../../../../ui/ButtonBack'

const ScheduleClassEnrollmentBack = ({ t, classId }) => (
  <ButtonBack returnUrl={ "/schedule/classes/all/enrollment/" + classId } />
)

export default withTranslation()(withRouter(ScheduleClassEnrollmentBack))