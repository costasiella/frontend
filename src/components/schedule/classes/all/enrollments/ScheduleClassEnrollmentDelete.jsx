import React from 'react'
import { useMutation } from '@apollo/client';
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import { DELETE_SCHEDULE_ITEM_ENROLLMENT, GET_SCHEDULE_ITEM_ENROLLMENTS_QUERY } from "./queries"
import ButtonDelete from '../../../../ui/ButtonDelete'


function ScheduleClassEnrollmentDelete({t, match, node}) {
  const scheduleItemId = match.params.class_id
  const [deleteScheduleItemEnrollment] = useMutation(DELETE_SCHEDULE_ITEM_ENROLLMENT)

    return (
      <ButtonDelete
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
                variables: {
                  scheduleItem: scheduleItemId
                }},
            ]
          }}
      />
    )
}


export default withTranslation()(withRouter(ScheduleClassEnrollmentDelete))
