import React from 'react'
import { useMutation } from '@apollo/client'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Alert,
  Button,
  Icon
} from "tabler-react";
import { toast } from 'react-toastify'

import { get_attendance_list_query_variables } from "../attendance/tools"
import { GET_SCHEDULE_CLASS_ATTENDANCE_QUERY } from "../attendance/queries"
import { CREATE_SCHEDULE_ITEM_ATTENDANCE } from "./queries"

import { getUrlFromReturnTo } from "./tools"


function SubscriptionCheckinButton({t, match, history, subscription, returnTo, locationId=null}) {
  console.log(subscription)
  const account_id = match.params.account_id
  const schedule_item_id = match.params.class_id
  const class_date = match.params.date

  const createInput = {
    "account": account_id,
    "scheduleItem": schedule_item_id,
    "accountSubscription": subscription.accountSubscription.id,
    "date": class_date,
    "attendanceType": "SUBSCRIPTION",
    "bookingStatus": "ATTENDING"
  }

  const [classCheckin, { loading, error }] = useMutation(CREATE_SCHEDULE_ITEM_ATTENDANCE)

  if (loading) {
    return <Button 
      block 
      outline 
      disabled={true}
      color="success" 
    >
      {t("schedule.classes.class.processing_checkin")}
    </Button>
  }

  if (error) {
    console.log(error)
    return <Alert type="danger">
      {t("schedule.classes.class.unable_to_book_class")}
    </Alert>
  }

  const returnUrl = getUrlFromReturnTo({
    returnTo: returnTo,
    schedule_item_id: schedule_item_id,
    class_date: class_date,
    locationId: locationId
  })

  if (subscription.blocked) {
    return (
      <p className="text-muted">
        <Icon name="alert-triangle" />
        {t("schedule.classes.class.book.subscription_blocked")}
      </p>
    )
  }

  if (subscription.paused) {
    return (
      <p className="text-muted">
        <Icon name="pause" />
        {t("schedule.classes.class.book.subscription_paused")}
      </p>
    )
  }

  return (
    <Button 
      block 
      outline 
      color="success" 
      icon="check"
      onClick={() => classCheckin({
        variables: { "input": createInput }, 
        refetchQueries: [
          {query: GET_SCHEDULE_CLASS_ATTENDANCE_QUERY, variables: get_attendance_list_query_variables(schedule_item_id, class_date)},
        ]})
        .then(({ data }) => {
            console.log('got data', data);
            // redirect back to attendance list
            history.push(returnUrl)
            // show message to user
            toast.success((t('schedule.classes.class.book.toast_success')), {
              position: toast.POSITION.BOTTOM_RIGHT
            })
          }).catch((error) => {
            toast.error((t('general.toast_server_error')) +  error, {
                position: toast.POSITION.BOTTOM_RIGHT
              })
            console.log('there was an error sending the query', error)
          })}
    >
      {t("general.checkin")}
    </Button>
  )
}


export default withTranslation()(withRouter(SubscriptionCheckinButton))

