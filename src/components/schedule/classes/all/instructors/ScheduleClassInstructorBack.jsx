import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import ButtonBack from '../../../../ui/ButtonBack'

const ScheduleClassInstructorBack = ({ t, classId }) => (
  <ButtonBack returnUrl={ "/schedule/classes/all/instructors/" + classId } />
)

export default withTranslation()(withRouter(ScheduleClassInstructorBack))