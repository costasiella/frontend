import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import CSLS from '../../../../../tools/cs_local_storage'
import ButtonBack from '../../../../ui/ButtonBack'

const ScheduleClassBookBack = () => (
  <ButtonBack returnUrl={localStorage.getItem(CSLS.SCHEDULE_CLASSES_BOOK_RETURN)} />
)

export default withTranslation()(withRouter(ScheduleClassBookBack))