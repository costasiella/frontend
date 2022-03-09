import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import {
  Card,
} from "tabler-react";

import { GET_SCHEDULE_SHIFT_WEEKLY_OTCS_QUERY, UPDATE_SCHEDULE_ITEM_WEEKLY_OTC } from './queries'
import { GET_SHIFTS_QUERY } from '../../queries'
import { get_list_query_variables } from '../../tools'
// import { SCHEDULE_CLASS_EDIT_OTC_SCHEMA } from './yupSchema'
import ScheduleShiftEditForm from './ScheduleShiftEditForm'
import { TimeStringToJSDateOBJ, dateToLocalISOTime } from '../../../../../tools/date_tools'

import { shiftSubtitle } from "../tools"

import ScheduleShiftEditBase from "../ScheduleShiftEditBase"
import ScheduleShiftWeeklyOTCDelete from './ScheduleShiftWeeklyOTCDelete'


function ScheduleShiftEdit({ t, match, history }) {
  let showDelete = false
  const scheduleItemId = match.params.shift_id
  const shiftDate = match.params.date
  const returnUrl = "/schedule/shifts"

  const query_vars = {
    scheduleItem: scheduleItemId,
    date: shiftDate
  }

  const { loading: queryLoading, error: queryError, data: queryData } = useQuery(GET_SCHEDULE_SHIFT_WEEKLY_OTCS_QUERY, {
    variables: query_vars,
  })
  const [ updateScheduleITEMWeeklyOTC ] = useMutation(UPDATE_SCHEDULE_ITEM_WEEKLY_OTC)

  if (queryLoading) return (
    <ScheduleShiftEditBase>
      <p>{t('general.loading_with_dots')}</p>
    </ScheduleShiftEditBase>
  )
  // Error
  if (queryError) {
    console.log(queryError)
    return (
      <ScheduleShiftEditBase>
        <p>{t('general.error_sad_smiley')}</p>
      </ScheduleShiftEditBase>
    )
  }

  console.log('queryData')
  console.log(queryData)

  const scheduleItem = queryData.scheduleItem
  const subtitle = shiftSubtitle({
    t: t,
    location: scheduleItem.organizationLocationRoom.organizationLocation.name, 
    locationRoom: scheduleItem.organizationLocationRoom.name,
    shift: scheduleItem.organizationShift.name, 
    timeStart: TimeStringToJSDateOBJ(scheduleItem.timeStart), 
    date: shiftDate
  })
  
  let initialData
  var initialValues = {}
  if (queryData.scheduleItemWeeklyOtcs.edges.length) {
    showDelete = true

    initialData = queryData.scheduleItemWeeklyOtcs.edges[0].node

    initialValues.status = initialData.status
    initialValues.description = initialData.description
    if (initialData.account) {
      initialValues.account = initialData.account.id
    }
    if (initialData.account2) {
      initialValues.account2 = initialData.account2.id
    }
    if (initialData.organizationLocationRoom) {
      initialValues.organizationLocationRoom = initialData.organizationLocationRoom.id
    }
    if (initialData.organizationShift) {
      initialValues.organizationShift = initialData.organizationShift.id
    }
    if (initialData.timeStart) {
      initialValues.timeStart = TimeStringToJSDateOBJ(initialData.timeStart)
    }
    if (initialData.timeEnd) {
      initialValues.timeEnd = TimeStringToJSDateOBJ(initialData.timeEnd)
    }
    
  } else {
    console.log('setting initial values')
    initialValues.status = ""
    initialValues.description = ""
    initialValues.account = ""
    initialValues.account2 = ""
    initialValues.organizationLocationRoom = ""
    initialValues.organizationShift = ""
    initialValues.timeStart = ""
    initialValues.timeEnd = ""
  }


  return (
    <ScheduleShiftEditBase subTitle={subtitle} pageHeaderButtonList={(showDelete) ? <ScheduleShiftWeeklyOTCDelete/> : ""}>
      <Card>
        <Card.Header>
          <Card.Title>{t('general.edit')}</Card.Title>
        </Card.Header>
        <Formik
          initialValues={initialValues}
          // validationSchema={SCHEDULE_CLASS_EDIT_OTC_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {

              console.log("SUBMIT VALUES")
              console.log(values)

              let timeStart = undefined
              let timeEnd = undefined
              if (values.timeStart) {
                timeStart = dateToLocalISOTime(values.timeStart)
              }
              
              if (values.timeEnd) {
                timeEnd = dateToLocalISOTime(values.timeEnd)  
              }
              

              updateScheduleITEMWeeklyOTC({ variables: {
                input: {
                  scheduleItem: scheduleItemId,
                  date: shiftDate,
                  status: values.status,
                  description: values.description,
                  account: values.account,
                  account2: values.account2,
                  organizationLocationRoom: values.organizationLocationRoom,
                  organizationShift: values.organizationShift,
                  timeStart: timeStart,
                  timeEnd: timeEnd,
                }
              }, refetchQueries: [
                  {query: GET_SCHEDULE_SHIFT_WEEKLY_OTCS_QUERY, variables: query_vars},
                  {query: GET_SHIFTS_QUERY, variables: get_list_query_variables()},
              ]})
              .then(({ data }) => {
                  console.log('got data', data);
                  toast.success((t('schedule.shifts.shift.edit.toast_edit_success')), {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  setSubmitting(false)
              }).catch((error) => {
                toast.error((t('general.toast_server_error')) +  error, {
                    position: toast.POSITION.BOTTOM_RIGHT
                  })
                console.log('there was an error sending the query', error)
                console.log('there was an error sending the query', error.graphQLErrors)
                setSubmitting(false)
              })
            }
          }
          >
          {({ isSubmitting, errors, values, setFieldTouched, setFieldValue }) => (
            <ScheduleShiftEditForm
              inputData={queryData}
              isSubmitting={isSubmitting}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
              errors={errors}
              values={values}
              returnUrl={returnUrl}
            >
              {console.log(errors)}
            </ScheduleShiftEditForm>
          )}
        </Formik>
      </Card>
    </ScheduleShiftEditBase>
  )
}


export default withTranslation()(withRouter(ScheduleShiftEdit))