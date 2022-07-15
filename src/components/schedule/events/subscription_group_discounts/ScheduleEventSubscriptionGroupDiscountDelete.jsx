import React from 'react'
import { useMutation } from '@apollo/client';
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import { 
  DELETE_SCHEDULE_EVENT_SUBSCRIPTION_GROUP_DISCOUNT, 
  GET_SCHEDULE_EVENT_SUBSCRIPTION_GROUP_DISCOUNT_QUERY 
} from "./queries"
import confirm_delete from "../../../../tools/confirm_delete"

import {
  Icon
} from "tabler-react"


function ScheduleEventSubscriptionGroupDiscountDelete({t, match, history, node}) {
  const eventId = match.params.event_id
  const [deleteScheduleEventSubscriptionGroupDiscount] = useMutation(
    DELETE_SCHEDULE_EVENT_SUBSCRIPTION_GROUP_DISCOUNT
  )
  const query_vars = {
    scheduleEvent: eventId
  }

  return (
    <button className="icon btn btn-link btn-sm mb-3 pull-right" 
      title={t('general.delete')} 
      onClick={() => {
        confirm_delete({
          t: t,
          msgConfirm: t("schedule.events.subscription_group_discounts.delete_confirm_msg"),
          msgDescription: <p>{node.organizationSubscriptionGroup.name} - {node.discountPercentage} %</p>,
          msgSuccess: t('schedule.events.subscription_group_discounts.delete_success'),
          deleteFunction: deleteScheduleEventSubscriptionGroupDiscount,
          functionVariables: { 
            variables: {
              input: {
                id: node.id
              },
            }, 
            refetchQueries: [
              { query: GET_SCHEDULE_EVENT_SUBSCRIPTION_GROUP_DISCOUNT_QUERY, variables: query_vars },
            ]
          }
        })
    }}>
      <Icon prefix="fe" name="trash-2" />
    </button>
  )
}

export default withTranslation()(withRouter(ScheduleEventSubscriptionGroupDiscountDelete))
