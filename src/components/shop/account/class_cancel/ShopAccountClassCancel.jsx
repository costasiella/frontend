import React, { useContext } from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

import AppSettingsContext from '../../../context/AppSettingsContext'

import {
  Button,
  Card,
  Dimmer
} from "tabler-react"

import { DisplayClassInfo } from "../../tools"
import { UPDATE_SCHEDULE_ITEM_ATTENDANCE } from "../../../schedule/classes/class/attendance/queries"
import { GET_ACCOUNT_CLASS_QUERY } from "./queries"
// import { GET_SCHEDULE_CLASS_QUERY } from "../../checkout/class_info/queries"
import GET_USER_PROFILE from "../../../../queries/system/get_user_profile"
import ShopAccountClassCancelBase from "./ShopAccountClassCancelBase"



function ShopAccountClassCancel({t, match, history}) {
  const appSettings = useContext(AppSettingsContext)
  const dateFormat = appSettings.dateFormat
  const timeFormat = appSettings.timeFormatMoment

  const attendanceId = match.params.attendance_id
  const scheduleItemId = match.params.class_id
  const date = match.params.date
  const { loading: loadingAttendance, error: errorAttendance, data: dataAttendance } = useQuery(GET_ACCOUNT_CLASS_QUERY, {
    variables: { 
      id: attendanceId,
      scheduleItemId: scheduleItemId,
      date: date
    },
    fetchPolicy: "network-only"
  })
  const { loading: loadingUser, error: errorUser, data: dataUser } = useQuery(GET_USER_PROFILE)
  const [updateScheduleItemAttendance] = useMutation(UPDATE_SCHEDULE_ITEM_ATTENDANCE)

  if (loadingUser || loadingAttendance) return (
    <ShopAccountClassCancelBase>
      <Dimmer active={true} loader={true} />
    </ShopAccountClassCancelBase>
  )
  if (errorUser || errorAttendance) return (
    <ShopAccountClassCancelBase>
      {t("shop.account.class_info.error_loading_data")}
    </ShopAccountClassCancelBase>
  )

  const user = dataUser.user
  console.log(dataUser)
  console.log(dataAttendance)
  const scheduleItemAttendance = dataAttendance.scheduleItemAttendance

  // Booking already cancelled
  if (scheduleItemAttendance.bookingStatus === 'CANCELLED') {
    return (
      <ShopAccountClassCancelBase accountName={user.fullName}>
        <Card>
          <Card.Body>
            <h6>{t("shop.account.class_cancel.already_cancelled")}</h6>
          </Card.Body>
        </Card>
      </ShopAccountClassCancelBase>
    )
  }

  // Cancellation no longer possible
  if (!scheduleItemAttendance.cancellationPossible) {
    return (
      <ShopAccountClassCancelBase accountName={user.fullName}>
        <Card>
          <Card.Body>
            <h6>{t("shop.account.class_cancel.cancelation_not_possible")}</h6>
          </Card.Body>
        </Card>
      </ShopAccountClassCancelBase>
    )
  }

  // Show cancel option
  return (
    <ShopAccountClassCancelBase accountName={user.fullName}>
      <Card>
        <Card.Body>
          {/* TODO: Check if class already cancelled */}
          <h6>
            {t("shop.account.class_cancel.confirmation_question")}
          </h6>
          <DisplayClassInfo
            t={t}
            classDate={date}
            classData={dataAttendance.scheduleItemAttendance.scheduleItem}
            dateFormat={dateFormat}
            timeFormat={timeFormat}
          />
          <br />
          <Button
            className="mt-xs-3 mr-4"
            color="warning"
            onClick={() =>
              updateScheduleItemAttendance({ variables: {
                input: {
                  id: attendanceId,
                  bookingStatus: "CANCELLED"
                }
              }})
              .then(({ data }) => {
                  console.log('got data', data)
                  history.push("/shop/account/classes")
                  toast.success((t('shop.account.class_cancel.success')), {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                }).catch((error) => {
                  toast.error((t('general.toast_server_error')) +  error, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  console.log('there was an error sending the query', error)
                })
              }
          >
            {t("shop.account.class_cancel.confirm_yes")}
          </Button>
          <Link to={"/shop/account/classes"}>
            {t("shop.account.class_cancel.confirm_no")}
          </Link>
        </Card.Body>
      </Card>
    </ShopAccountClassCancelBase>
  )
}

export default withTranslation()(withRouter(ShopAccountClassCancel))
