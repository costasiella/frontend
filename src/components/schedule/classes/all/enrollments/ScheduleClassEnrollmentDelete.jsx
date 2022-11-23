import React from 'react'
import { useMutation } from '@apollo/client';
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import { DELETE_SCHEDULE_ITEM_ENROLLMENT, GET_SCHEDULE_ITEM_ENROLLMENTS_QUERY } from "./queries"
import { GET_ACCOUNT_ENROLLMENTS_QUERY } from "../../../../relations/accounts/enrollments/queries"
import ButtonDelete from '../../../../ui/ButtonDelete'
import { getEnrollmentsListQueryVariables } from './tools'

function ScheduleClassEnrollmentDelete({t, match, node}) {
  const scheduleItemId = node.scheduleItem.id
  const [deleteScheduleItemEnrollment] = useMutation(DELETE_SCHEDULE_ITEM_ENROLLMENT)

    return (
      <ButtonDelete
        className="float-right"
        msgConfirm={t("schedule.classes.class.enrollments.delete_confirm_msg")}
        msgDescription={<p>{node.accountSubscription.account.fullName}</p>}
        msgSuccess={t('schedule.classes.class.enrollments.delete_success')}
        deleteFunction={deleteScheduleItemEnrollment}
        deleteFunctionVariables={{ 
            variables: {
              input: {
                id: node.id
              }
            }, 
            refetchQueries: [
              { query: GET_SCHEDULE_ITEM_ENROLLMENTS_QUERY, 
                variables: getEnrollmentsListQueryVariables(scheduleItemId) },
              { query: GET_ACCOUNT_ENROLLMENTS_QUERY, 
                variables: { account: node.accountSubscription.account.id }}  
            ]
          }}
      />
    )
}


export default withTranslation()(withRouter(ScheduleClassEnrollmentDelete))
