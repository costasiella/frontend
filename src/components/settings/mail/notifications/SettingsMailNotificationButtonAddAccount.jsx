import React from 'react'
import { useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { toast } from 'react-toastify'
import {
  Button,
  Icon
} from "tabler-react";

import { CREATE_NOTIFICATION_ACCOUNT, GET_NOTIFICATIONS_QUERY } from "./queries"


function SettingsMailNotificationButtonAddAccount({ t, match, history, accountId })  {
  const notificationId = match.params.id
  const [ createNotificationAccount ] = useMutation(CREATE_NOTIFICATION_ACCOUNT)
  
  return (
    <Button
      color="secondary"
      onClick={ () => (
        createNotificationAccount({ variables: {
          input: {
            systemNotification: notificationId,
            account: accountId
          }}, 
          refetchQueries: [
            {query: GET_NOTIFICATIONS_QUERY}
        ]})
        .then(({ data }) => {
          console.log('got data', data)
          history.push(`/settings/mail/notifications`)
          toast.success((t('settings.mail.notifications.toast_add_success')), {
            position: toast.POSITION.BOTTOM_RIGHT
          })
        }).catch((error) => {
          toast.error((t('general.toast_server_error')) +  error, {
            position: toast.POSITION.BOTTOM_RIGHT
          })
          console.log('there was an error sending the query', error)
          // setSubmitting(false)
        })
      )}
    >
      <Icon name="plus-circle" /> {t("settings.mail.notifications.btn_add_account")}
    </Button>
  )
}


export default withTranslation()(withRouter(SettingsMailNotificationButtonAddAccount))
