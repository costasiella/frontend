import React from 'react'
import { useMutation } from '@apollo/client';
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import { DELETE_MAILCHIMP_LIST, GET_MAILCHIMP_LISTS_QUERY } from "./queries"
import ButtonDelete from '../../../ui/ButtonDelete';


function SettingsMailMailChimpListDelete({t, match, node}) {
  const [ deleteMailChimpList ] = useMutation(DELETE_MAILCHIMP_LIST)

  return <ButtonDelete
    msgConfirm={t("settings.mail.mailchimp_lists.delete_confirm_msg")}
    msgDescription={<p>{node.name}</p>}
    msgSuccess={t('settings.mail.mailchimp_lists.delete_success')}
    deleteFunction={deleteMailChimpList}
    deleteFunctionVariables={{ 
        variables: {
          input: {
            id: node.id
          }
        }, 
        refetchQueries: [
          { query: GET_MAILCHIMP_LISTS_QUERY },
        ]
      }}
  />
}


export default withTranslation()(withRouter(SettingsMailMailChimpListDelete))
