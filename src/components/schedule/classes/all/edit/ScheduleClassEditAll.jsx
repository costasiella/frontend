import React from 'react'
import { useQuery, useMutation } from "@apollo/client";

import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_CLASSES_QUERY, GET_CLASS_QUERY } from '../../queries'
import { UPDATE_CLASS } from './queries'

import { get_list_query_variables } from '../../tools'
import { CLASS_SCHEMA } from '../../yupSchema'
import ScheduleClassForm from '../../ScheduleClassForm'

import { dateToLocalISO, dateToLocalISOTime, TimeStringToJSDateOBJ } from '../../../../../tools/date_tools'
import ClassEditBase from '../ClassEditBase'
import { Card } from 'tabler-react';


function ScheduleClassEditAll({t, match}) {
  const id = match.params.class_id
  const menuActiveLink = "edit"
  const returnUrl = "/schedule/classes"
  const cardTitle = t('schedule.classes.title_edit')
  const { loading, error, data } = useQuery(GET_CLASS_QUERY, {
    variables: { id: id }
  })
  const [ updateScheduleClass ] = useMutation(UPDATE_CLASS)

  if (loading) return (
    <ClassEditBase menu_activeLink={menuActiveLink}>
      <Card.Body>
        <p>{t('general.loading_with_dots')}</p>
      </Card.Body>
    </ClassEditBase>
  )

  if (error) return (
    <ClassEditBase menu_activeLink={menuActiveLink}>
      <Card.Body>
        <p>{t('general.error_sad_smiley')}</p>
      </Card.Body>
    </ClassEditBase>
  )

  console.log('query data')
  console.log(data)
  const inputData = data
  const initialValues = data.scheduleItem

  let initialLevelID = ""
  if (initialValues.organizationLevel) {
    initialLevelID = initialValues.organizationLevel.id
  }

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
    <ClassEditBase 
      menuActiveLink={menuActiveLink}
      defaultCard={false}
    >
      <Card title={cardTitle}>
        <Formik
          initialValues={{ 
            displayPublic: initialValues.displayPublic,
            frequencyType: initialValues.frequencyType,
            frequencyInterval: initialValues.frequencyInterval,
            organizationLocationRoom: initialValues.organizationLocationRoom.id,
            organizationClasstype: initialValues.organizationClasstype.id,
            organizationLevel: initialLevelID,
            dateStart: dateStart,
            dateEnd: dateEnd,
            timeStart: initialTimeStart,
            timeEnd: initialTimeEnd,
            spaces: initialValues.spaces,
            walkInSpaces: initialValues.walkInSpaces,
            infoMailContent: initialValues.infoMailContent
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

              updateScheduleClass({ variables: {
                input: {
                  id: id,
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
                  walkInSpaces: values.walkInSpaces,
                  infoMailContent: values.infoMailContent
                }
              }, refetchQueries: [
                  {query: GET_CLASSES_QUERY, variables: get_list_query_variables()}
              ]})
              .then(({ data }) => {
                  console.log('got data', data)
                  toast.success((t('schedule.classes.toast_edit_success')), {
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
            <ScheduleClassForm
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
    </ClassEditBase>   
  )
}

export default withTranslation()(withRouter(ScheduleClassEditAll))