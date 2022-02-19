import React from 'react'
import { useMutation } from '@apollo/client';
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import { DELETE_SCHEDULE_ITEM_PRICE, GET_SCHEDULE_ITEM_PRICES_QUERY } from "./queries"

import ButtonDelete from '../../../../ui/ButtonDelete';


function ScheduleClassPriceDelete({t, match, history, id}) {
  const classId = match.params.class_id
  const [deleteClassPrice] = useMutation(DELETE_SCHEDULE_ITEM_PRICE)
  const query_vars = {
    scheduleItem: classId
  }

  return (
    <ButtonDelete 
      msgConfirm={t("schedule.classes.prices.delete_confirm_msg")}
      msgDescription={""}
      msgSuccess={t('schedule.classes.prices.delete_success')}
      deleteFunction={deleteClassPrice}
      deleteFunctionVariables={
        { 
          variables: {
            input: {
              id: id
            },
          }, 
          refetchQueries: [
            { query: GET_SCHEDULE_ITEM_PRICES_QUERY, variables: query_vars },
          ]
        }
      }
    />
  )
}


export default withTranslation()(withRouter(ScheduleClassPriceDelete))