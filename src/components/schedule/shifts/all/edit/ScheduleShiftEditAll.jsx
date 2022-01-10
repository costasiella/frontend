// @flow

import React from 'react'
import { useQuery, useMutation } from "@apollo/client";

import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_SHIFTS_QUERY, GET_SHIFT_QUERY } from '../../queries'
import { UPDATE_SHIFT } from './queries'

import { get_list_query_variables } from '../../tools'
import { SHIFT_SCHEMA } from '../../yupSchema'
import ScheduleShiftForm from '../../ScheduleShiftForm'

import { dateToLocalISO, dateToLocalISOTime, TimeStringToJSDateOBJ } from '../../../../../tools/date_tools'
import ShiftEditBack from "../ShiftEditBack"
import ShiftEditBase from '../ShiftEditBase'
import { Card } from 'tabler-react';


function ScheduleShiftEditAll({t, match}) {
  const id = match.params.shift_id
  const menuActiveLink = "edit"
  const returnUrl = "/schedule/shifts"
  const cardTitle = t('schedule.shifts.title_edit')
  const pageHeaderButtonList = <ShiftEditBack />
  const { loading, error, data } = useQuery(GET_SHIFT_QUERY, {
    variables: { id: id }
  })
  const [ updateScheduleShift ] = useMutation(UPDATE_SHIFT)

  if (loading) return (
    <ShiftEditBase menu_activeLink={menuActiveLink} pageHeaderButtonList={pageHeaderButtonList}>
      <Card.Body>
        <p>{t('general.loading_with_dots')}</p>
      </Card.Body>
    </ShiftEditBase>
  )

  if (error) return (
    <ShiftEditBase menu_activeLink={menuActiveLink} pageHeaderButtonList={pageHeaderButtonList}>
      <Card.Body>
        <p>{t('general.error_sad_smiley')}</p>
      </Card.Body>
    </ShiftEditBase>
  )

  console.log('query data')
  console.log(data)
  const inputData = data
  const initialValues = data.scheduleItem

  const initialTimeStart = TimeStringToJSDateOBJ(initialValues.timeStart)
  const initialTimeEnd = TimeStringToJSDateOBJ(initialValues.timeEnd)
  // DatePicker doesn't like a string as an initial value
  // This makes it a happy DatePicker :)
  let dateStart = null
  let dateEnd = null
  if (initialValues.dateStart) {
    dateStart = new Date(initialValues.dateStart)
  }
  if (initialValues.dateEnd) {
    dateEnd = new Date(initialValues.dateEnd)
  }


  return (
    <ShiftEditBase 
      menuActiveLink={menuActiveLink}
      defaultCard={false}
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <Card title={cardTitle}>
        <Formik
          initialValues={{ 
            frequencyType: initialValues.frequencyType,
            frequencyInterval: initialValues.frequencyInterval,
            organizationLocationRoom: initialValues.organizationLocationRoom.id,
            organizationShift: initialValues.organizationShift.id,
            dateStart: dateStart,
            dateEnd: dateEnd,
            timeStart: initialTimeStart,
            timeEnd: initialTimeEnd,
          }}
          validationSchema={SHIFT_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              console.log('submit values:')
              console.log(values)

              let frequencyInterval = values.frequencyInterval
              if (values.frequencyType == 'SPECIFIC')
                frequencyInterval = 0

              let dateEnd
                if (values.dateEnd) {
                  dateEnd = dateToLocalISO(values.dateEnd)
                } else {
                  dateEnd = values.dateEnd
                }  

              updateScheduleShift({ variables: {
                input: {
                  id: id,
                  frequencyType: values.frequencyType,
                  frequencyInterval: frequencyInterval,
                  organizationLocationRoom: values.organizationLocationRoom,
                  organizationShift: values.organizationShift,
                  dateStart: dateToLocalISO(values.dateStart),
                  dateEnd: dateEnd,
                  timeStart: dateToLocalISOTime(values.timeStart),
                  timeEnd: dateToLocalISOTime(values.timeEnd),
                }
              }, refetchQueries: [
                  {query: GET_SHIFTS_QUERY, variables: get_list_query_variables()}
              ]})
              .then(({ data }) => {
                  console.log('got data', data)
                  toast.success((t('schedule.shifts.toast_edit_success')), {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  setSubmitting(false)
                }).catch((error) => {
                  toast.error((t('general.toast_server_error')) +  error, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  console.log('there was an error sending the query', error)
                  setSubmitting(false)
                })
          }}
          >
          {({ isSubmitting, setFieldValue, setFieldTouched, errors, values, touched }) => (
            <ScheduleShiftForm
              inputData={inputData}
              isSubmitting={isSubmitting}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              errors={errors}
              values={values}
              touched={touched}
              returnUrl={returnUrl}
            />
          )}
        </Formik>      
      </Card>
    </ShiftEditBase>   
  )
}

export default withTranslation()(withRouter(ScheduleShiftEditAll))