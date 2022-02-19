import React from 'react'
import { useMutation } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Button,
  Icon,
} from "tabler-react";
import { toast } from 'react-toastify'

import { CREATE_SCHEDULE_ITEM_ATTENDANCE } from "../../../schedule/classes/class/book/queries"


function ShopClassBookSubscriptionBtn({t, match, history, subscription}) {
  const schedule_item_id = match.params.class_id
  const class_date = match.params.date

  const createInput = {
    "scheduleItem": schedule_item_id,
    "accountSubscription": subscription.accountSubscription.id,
    "date": class_date,
    "attendanceType": "SUBSCRIPTION",
    "onlineBooking": true,
    "bookingStatus": "BOOKED"
  }

  const [classCheckin, { loading, error }] = useMutation(CREATE_SCHEDULE_ITEM_ATTENDANCE)

  if (loading) {
    return t("general.please_wait")
  }

  if (error) {
    return t("general.error_sad_smiley")
  }

  return (
    <Button 
      block 
      outline 
      color="primary" 
      onClick={() => classCheckin({
        variables: { "input": createInput }, 
        refetchQueries: [
          // {query: GET_SCHEDULE_CLASS_ATTENDANCE_QUERY, variables: get_attendance_list_query_variables(schedule_item_id, class_date)},
        ]})
        .then(({ data }) => {
            console.log('got data', data);
            // redirect to class booked page
            console.log("Checkin success!")
            history.push(`/shop/classes/booked/${schedule_item_id}/${class_date}`)

            // show message to user
            // toast.success((t('schedule.classes.class.book.toast_success')), {
            //   position: toast.POSITION.BOTTOM_RIGHT
            // })
          }).catch((error) => {
            toast.error((t('general.toast_server_error')) +  error, {
                position: toast.POSITION.BOTTOM_RIGHT
              })
            console.log('there was an error sending the query', error)
          })}
    >
      {t("general.book")} <Icon name="chevron-right" />
    </Button>
  )
}


export default withTranslation()(withRouter(ShopClassBookSubscriptionBtn))

