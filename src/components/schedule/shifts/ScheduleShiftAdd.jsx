import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_SHIFTS_QUERY, GET_INPUT_VALUES_QUERY, CREATE_SHIFT } from './queries'
import { get_list_query_variables } from './tools'
import { SHIFT_SCHEMA } from './yupSchema'
import ScheduleShiftForm from './ScheduleShiftForm'


import {
  Card,
} from "tabler-react"
import { dateToLocalISO, dateToLocalISOTime } from '../../../tools/date_tools'

import ScheduleShiftAddBase from './ScheduleShiftAddBase'


function ScheduleShiftAdd({t, history}) {
  const cardTitle = t('schedule.shifts.title_add')
  const returnUrl = "/schedule/shifts"
  const { loading, error, data } = useQuery(GET_INPUT_VALUES_QUERY)
  const [ createScheduleShift ] = useMutation(CREATE_SHIFT)
  

  if (loading) return (
    <ScheduleShiftAddBase>
      <Card title={cardTitle}>
        <Card.Body>
          <p>{t('general.loading_with_dots')}</p>
        </Card.Body>
      </Card>
    </ScheduleShiftAddBase>
  )

  if (error) return (
    <ScheduleShiftAddBase>
      <Card title={cardTitle}>
        <Card.Body>
          <p>{t('general.error_sad_smiley')}</p>
        </Card.Body>
      </Card>
    </ScheduleShiftAddBase>
  )

  const inputData = data

  return (
    <ScheduleShiftAddBase>
      <Card title={cardTitle}>
        <Formik
          initialValues={{ 
            displayPublic: true,
            frequencyType: "WEEKLY",
            frequencyInterval: 1,
            organizationLocationRoom: "",
            organizationShift: "",
            dateStart: new Date(),
            timeStart: new Date(),
            timeEnd: new Date(),
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
              
              createScheduleShift({ variables: {
                input: {
                  frequencyType: values.frequencyType,
                  frequencyInterval: frequencyInterval,
                  organizationLocationRoom: values.organizationLocationRoom,
                  organizationShift: values.organizationShift,
                  dateStart: dateToLocalISO(values.dateStart),
                  dateEnd: dateEnd,
                  timeStart: dateToLocalISOTime(values.timeStart),
                  timeEnd: dateToLocalISOTime(values.timeEnd)
                }
              }, refetchQueries: [
                  {query: GET_SHIFTS_QUERY, variables: get_list_query_variables()}
              ]})
              .then(({ data }) => {
                  console.log('got data', data)
                  toast.success((t('schedule.shifts.toast_add_success')), {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  history.push(returnUrl)
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
                >
                </ScheduleShiftForm>
              )
           }
        </Formik>
      </Card>      
    </ScheduleShiftAddBase>
  )
}

export default withTranslation()(withRouter(ScheduleShiftAdd))