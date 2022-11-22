import React from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
  Alert,
  Button,
  Card,
  Dimmer,
  Dropdown,
  Icon,
  Table
} from "tabler-react";
import HasPermissionWrapper from "../../../HasPermissionWrapper"
import { toast } from 'react-toastify'
// import { get_attendance_list_query_variables } from "./tools"

import { GET_ACCOUNT } from '../../../../queries/accounts/get_account'

// import ContentCard from "../../../../general/ContentCard"
// import ButtonConfirm from '../../../../ui/ButtonConfirm'
import SearchClassesOnDate from '../../../ui/SearchClassesOnDate'
import AccountEnrollmentsBase from "./AccountEnrollmentsBase"
import { 
  GET_ACCOUNT_ENROLLMENTS_QUERY,
  CREATE_SCHEDULE_ITEM_ENROLLMENT
} from "./queries"


// function setAttendanceStatus({t, match, updateAttendance, node, status}) {
//   const schedule_item_id = match.params.class_id
//   const class_date = match.params.date

//   updateAttendance({
//     variables: { 
//       input: {
//         id: node.id, 
//         bookingStatus: status
//       }
//     },
//     refetchQueries: [
//       {query: GET_SCHEDULE_CLASS_ATTENDANCE_QUERY, 
//         variables: get_attendance_list_query_variables(schedule_item_id, class_date)}
//     ]
//   }).then(({ data }) => {
//     console.log('got data', data);
//     toast.success(
//       t('schedule.classes.class.attendance.status_saved'), {
//         position: toast.POSITION.BOTTOM_RIGHT
//       })
//   }).catch((error) => {
//     toast.error((t('general.toast_server_error')) +  error, {
//         position: toast.POSITION.BOTTOM_RIGHT
//       })
//     console.log('there was an error sending the query', error);
//   })
// }


function AccountEnrollmentFindClass({ t, match, location }) {
  const accountId = match.params.account_id
  const { loading, error, data } = useQuery(GET_ACCOUNT, { variables: { accountId: accountId }})

  if (loading) { 
    return "loading"
  }

  if (error) { 
    return "error"
  }

  const account = data.account

  return (
    <AccountEnrollmentsBase account={account} >
      <h5>{t('relations.account.enrollments.title_add_search_class')}</h5>
      <SearchClassesOnDate btnAction="accountEnrollmentAdd" />
    </AccountEnrollmentsBase>
  )
}


export default withTranslation()(withRouter(AccountEnrollmentFindClass))
