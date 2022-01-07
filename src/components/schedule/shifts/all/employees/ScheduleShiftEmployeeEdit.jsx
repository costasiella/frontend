import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_SCHEDULE_SHIFT_ACCOUNTS_QUERY, GET_SINGLE_SCHEDULE_SHIFT_ACCOUNTS_QUERY, UPDATE_SCHEDULE_SHIFT_ACCOUNT } from './queries'
import { SCHEDULE_CLASS_TEACHER_SCHEMA } from './yupSchema'
import ScheduleShiftEmployeeForm from './ScheduleShiftEmployeeForm'
import { dateToLocalISO } from '../../../../../tools/date_tools'

import ShiftEditBase from "../ShiftEditBase"
import ScheduleShiftEmployeeBack from "./ScheduleShiftEmployeeBack"
import { Card } from 'tabler-react';


function ScheduleShiftEmployeeEdit({ t, match, history }) {
  const id = match.params.id
  const shiftId = match.params.shift_id
  const returnUrl = `/schedule/shifts/all/employees/${shiftId}`
  const cardTitle = t('schedule.shifts.employees.title_edit')
  const menuActiveLink = "teachers"
  const pageHeaderButtonList = <ScheduleShiftEmployeeBack shiftId={shiftId} />

  const {loading, error, data} = useQuery(GET_SINGLE_SCHEDULE_SHIFT_ACCOUNTS_QUERY, {
    variables: { id: id }
  })
  const [updateScheduleShiftAccount] = useMutation(UPDATE_SCHEDULE_SHIFT_ACCOUNT)

  if (loading) return (
    <ShiftEditBase
      cardTitle={cardTitle}
      menuActiveLink={menuActiveLink}
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <Card.Body>
        <p>{t('general.loading_with_dots')}</p>
      </Card.Body>
    </ShiftEditBase>
  )

  if (error) return (
    <ShiftEditBase
      cardTitle={cardTitle}
      menuActiveLink={menuActiveLink}
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <Card.Body>
        <p>{t('general.error_sad_smiley')}</p>
      </Card.Body>
    </ShiftEditBase>
  )

  console.log('query data')
  console.log(data)
  const inputData = data
  const initialData = data.scheduleItemAccount

  let initialAccount2 = ""
  if (initialData.account2) {
    initialAccount2 =  initialData.account2.id
  } 

  // DatePicker doesn't like a string as an initial value
  // This makes it a happy DatePicker :)
  let dateStart = null
  if (initialData.dateStart) {
    dateStart = new Date(initialData.dateStart)
  }
  
  let dateEnd = null
  if (initialData.dateEnd) {
    dateEnd = new Date(initialData.dateEnd)
  }

  return (
    <ShiftEditBase 
      cardTitle={cardTitle}
      menuActiveLink="teachers"
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <Formik
        initialValues={{  
          dateStart: dateStart,
          dateEnd: dateEnd,
          account: initialData.account.id,
          account2: initialAccount2,
        }}
        // validationSchema={SCHEDULE_CLASS_TEACHER_SCHEMA}
        onSubmit={(values, { setSubmitting }) => {

            let dateEnd
            if (values.dateEnd) {
              dateEnd = dateToLocalISO(values.dateEnd)
            } else {
              dateEnd = values.dateEnd
            }

            updateScheduleShiftAccount({ variables: {
              input: {
                id: match.params.id,
                account: values.account,
                account2: values.account2,
                dateStart: dateToLocalISO(values.dateStart),
                dateEnd: dateEnd
              }
            }, refetchQueries: [
                {query: GET_SCHEDULE_SHIFT_ACCOUNTS_QUERY, variables: { scheduleItem: shiftId }},
                // {query: GET_SUBSCRIPTIONS_QUERY, variables: {"archived": false }},
            ]})
            .then(({ data }) => {
                console.log('got data', data);
                toast.success((t('schedule.shifts.employees.toast_edit_success')), {
                    position: toast.POSITION.BOTTOM_RIGHT
                  })
              }).catch((error) => {
                toast.error((t('general.toast_server_error')) +  error, {
                    position: toast.POSITION.BOTTOM_RIGHT
                  })
                console.log('there was an error sending the query', error)
                setSubmitting(false)
              })
        }}
        >
        {({ isSubmitting, errors, values, setFieldTouched, setFieldValue }) => (
          <ScheduleShiftEmployeeForm
            inputData={inputData}
            isSubmitting={isSubmitting}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
            errors={errors}
            values={values}
            returnUrl={returnUrl}
          >
            {console.log(errors)}
          </ScheduleShiftEmployeeForm>
        )}
      </Formik>
    </ShiftEditBase>
  )
}


export default withTranslation()(withRouter(ScheduleShiftEmployeeEdit))