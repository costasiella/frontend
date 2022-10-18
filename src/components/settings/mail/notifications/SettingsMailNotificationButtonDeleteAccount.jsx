import React from 'react'
import { useMutation } from '@apollo/client';
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import { DELETE_NOTIFICATION_ACCOUNT, GET_NOTIFICATIONS_QUERY } from "./queries"
import confirm_delete from '../../../../tools/confirm_delete';

import {
  Icon
} from "tabler-react"



function SettingsMailNotificationsDeleteAccount({t, match, node, accountId, notificationId}) {
  const [deleteNotificationAccount ] = useMutation(DELETE_NOTIFICATION_ACCOUNT)

    return (
      <button className="icon btn btn-link btn-sm pull-right" 
        title={t('general.delete')} 
        href=""
        onClick={() => {
          confirm_delete({
            t: t,
            msgConfirm: t("settings.mail.notifications.delete_confirm_msg"),
            msgDescription: <p>{node.fullName}</p>,
            msgSuccess: t('settings.mail.notifications.delete_success'),
            deleteFunction: deleteNotificationAccount,
            functionVariables: { 
              variables: {
                input: {
                  account: accountId,
                  systemNotification: notificationId
                }
              }, 
              refetchQueries: [
                { query: GET_NOTIFICATIONS_QUERY },
              ]
            }
          })
      }}>
        <span className="text-red"><Icon prefix="fe" name="trash-2" /></span>
      </button>
    )
}


export default withTranslation()(withRouter(SettingsMailNotificationsDeleteAccount))
