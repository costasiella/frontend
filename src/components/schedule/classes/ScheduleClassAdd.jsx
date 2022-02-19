import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_CLASSES_QUERY, GET_INPUT_VALUES_QUERY, CREATE_CLASS } from './queries'
import { get_list_query_variables } from './tools'
import { CLASS_SCHEMA } from './yupSchema'
import ScheduleClassForm from './ScheduleClassForm'


import {
  Card,
} from "tabler-react"
import { dateToLocalISO, dateToLocalISOTime } from '../../../tools/date_tools'

import ScheduleClassAddBase from './ScheduleClassAddBase'


function ScheduleClassAdd({t, history}) {
  const cardTitle = t('schedule.classes.title_add')
  const returnUrl = "/schedule/classes"
  const { loading, error, data } = useQuery(GET_INPUT_VALUES_QUERY)
  const [ createScheduleClass ] = useMutation(CREATE_CLASS)
  

  if (loading) return (
    <ScheduleClassAddBase>
      <Card title={cardTitle}>
        <Card.Body>
          <p>{t('general.loading_with_dots')}</p>
        </Card.Body>
      </Card>
    </ScheduleClassAddBase>
  )

  if (error) return (
    <ScheduleClassAddBase>
      <Card title={cardTitle}>
        <Card.Body>
          <p>{t('general.error_sad_smiley')}</p>
        </Card.Body>
      </Card>
    </ScheduleClassAddBase>
  )

  const inputData = data

  return (
    <ScheduleClassAddBase>
      <Card title={cardTitle}>
        <Formik
          initialValues={{ 
            displayPublic: true,
            frequencyType: "WEEKLY",
            frequencyInterval: 1,
            organizationLocationRoom: "",
            organizationClasstype: "",
            organizationLevel: "",
            dateStart: new Date(),
            timeStart: new Date(),
            timeEnd: new Date(),
            spaces: "",
            walkInSpaces: ""
          }}
          validationSchema={CLASS_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              console.log('submit values:')
              console.log(values)

              let frequencyInterval = values.frequencyInterval
              if (values.frequencyType === 'SPECIFIC')
                frequencyInterval = 0

              let dateEnd
                if (values.dateEnd) {
                  dateEnd = dateToLocalISO(values.dateEnd)
                } else {
                  dateEnd = values.dateEnd
                }
              
              createScheduleClass({ variables: {
                input: {
                  displayPublic: values.displayPublic,
                  frequencyType: values.frequencyType,
                  frequencyInterval: frequencyInterval,
                  organizationLocationRoom: values.organizationLocationRoom,
                  organizationClasstype: values.organizationClasstype,
                  organizationLevel: values.organizationLevel,
                  dateStart: dateToLocalISO(values.dateStart),
                  dateEnd: dateEnd,
                  timeStart: dateToLocalISOTime(values.timeStart),
                  timeEnd: dateToLocalISOTime(values.timeEnd),
                  spaces: values.spaces,
                  walkInSpaces: values.walkInSpaces
                }
              }, refetchQueries: [
                  {query: GET_CLASSES_QUERY, variables: get_list_query_variables()}
              ]})
              .then(({ data }) => {
                  console.log('got data', data)
                  const classId = data.createScheduleClass.scheduleItem.id
                  history.push(`/schedule/classes/all/edit/${classId}`)
                  toast.success((t('schedule.classes.toast_add_success')), {
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
          {({ isSubmitting, setFieldValue, setFieldTouched, errors, values, touched }) => (
                <ScheduleClassForm
                  inputData={inputData}
                  isSubmitting={isSubmitting}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  errors={errors}
                  values={values}
                  touched={touched}
                  returnUrl={returnUrl}
                >
                </ScheduleClassForm>
              )
           }
        </Formik>
      </Card>      
    </ScheduleClassAddBase>
  )
}

export default withTranslation()(withRouter(ScheduleClassAdd))