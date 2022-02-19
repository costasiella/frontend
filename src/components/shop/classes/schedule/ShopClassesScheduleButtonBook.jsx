import React, { useContext } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import moment from 'moment'

import AppSettingsContext from '../../../context/AppSettingsContext'

import {
  Button,
  Icon,
} from "tabler-react";


function ShopClassesScheduleButtonBook({ t, match, history, scheduleItemId, classDate, bookingOpenOn, bookingStatus }) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat

  let buttonBook
  // Uncomment the line below when testing the book component statuses. (Development only)
  // bookingStatus = "OK"

  switch(bookingStatus) {
    case "NOT_YET_OPEN":
      buttonBook = <span className="pull-right">
          {t("shop.classes.class_booking_status.open_on") + " " + moment(bookingOpenOn).format(dateFormat)}
        </span>
      break
    case "CANCELLED":
      buttonBook = <span className="pull-right">
          {t("shop.classes.class_booking_status.cancelled")}
        </span>
      break
    case "HOLIDAY":
      buttonBook = <span className="pull-right">
          {t("shop.classes.class_booking_status.cancelled_holiday")}
        </span>
      break
    case "FINISHED":
      buttonBook = <span className="pull-right">
          {t("shop.classes.class_booking_status.finished")}
        </span>
      break
    case "ONGOING":
      buttonBook = <span className="pull-right">
          {t("shop.classes.class_booking_status.ongoing")}
        </span>
      break
    case "FULL":
      buttonBook = <span className="pull-right">
          {t("shop.classes.class_booking_status.full")}
        </span>
      break
    case "OK":
      buttonBook = <Link to={`/shop/classes/book/${scheduleItemId}/${classDate}`}>
          <Button className="pull-right" color="primary" outline>
            {t("general.book")} <Icon name="chevron-right" />
          </Button>
        </Link>
      break
    
    default:
      buttonBook = ""
  }
  
  return buttonBook
}


export default withTranslation()(withRouter(ShopClassesScheduleButtonBook))
