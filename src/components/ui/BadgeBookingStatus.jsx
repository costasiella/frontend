import React from 'react'
import { withTranslation } from 'react-i18next'

import {
  Badge
} from "tabler-react"


function BadgeBookingStatus({ t, status }) {
  switch (status) {
    case "ATTENDING":
      return <Badge color="success">{t('schedule.classes.class.attendance.booking_status.ATTENDING')}</Badge> 
    case "BOOKED":
      return <Badge color="primary">{t('schedule.classes.class.attendance.booking_status.BOOKED')}</Badge> 
    case "CANCELLED":
      return <Badge color="warning">{t('schedule.classes.class.attendance.booking_status.CANCELLED')}</Badge> 
    default:
      return t("schedule.classes.class.attendance.booking_status.invalid_type")
  }
}

export default withTranslation()(BadgeBookingStatus)