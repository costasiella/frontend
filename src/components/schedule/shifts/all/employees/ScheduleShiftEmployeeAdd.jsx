import React from 'react'
import { useMutation, useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { Card } from 'tabler-react';

import { GET_SCHEDULE_SHIFT_ACCOUNTS_QUERY, GET_INPUT_VALUES_QUERY, ADD_SCHEDULE_SHIFT_ACCOUNT } from './queries'
import { SCHEDULE_SHIFT_EMPLOYEE_SCHEMA } from './yupSchema'
import ScheduleShiftEmployeeForm from './ScheduleShiftEmployeeForm'
import { dateToLocalISO } from '../../../../../tools/date_tools'

import ShiftEditBase from "../ShiftEditBase"
import ScheduleShiftEmployeeBack from "./ScheduleShiftEmployeeBack"


function ScheduleShiftEmployeeAdd({ t, history, match }) {
  const shiftId = match.params.shift_id
  const returnUrl = `/schedule/shifts/all/employees/${shiftId}`
  const cardTitle = t('schedule.shifts.employees.title_add')
  const menuActiveLink = "employees" 
  const pageHeaderButtonList = <ScheduleShiftEmployeeBack shiftId={shiftId} />

  const {loading, error, data} = useQuery(GET_INPUT_VALUES_QUERY)
  const [addScheduleShiftAccount] = useMutation(ADD_SCHEDULE_SHIFT_ACCOUNT)

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

  return (
    <ShiftEditBase
      cardTitle={cardTitle}
      menuActiveLink={menuActiveLink}
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <Formik
        initialValues={{ 
          dateStart: new Date() ,
          account: "",
          account2: "",
        }}
        validationSchema={SCHEDULE_SHIFT_EMPLOYEE_SCHEMA}
        onSubmit={(values, { setSubmitting }) => {

            let dateEnd
            if (values.dateEnd) {
              dateEnd = dateToLocalISO(values.dateEnd)
            } else {
              dateEnd = values.dateEnd
            }

            addScheduleShiftAccount({ variables: {
              input: {
                scheduleItem: shiftId,
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
                history.push(returnUrl)
                toast.success((t('schedule.shifts.employees.toast_add_success')), {
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
          />
        )}
      </Formik>
    </ShiftEditBase>
  )
}

export default withTranslation()(withRouter(ScheduleShiftEmployeeAdd))