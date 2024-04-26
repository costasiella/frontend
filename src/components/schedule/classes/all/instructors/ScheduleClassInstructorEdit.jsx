// @flow

import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_SCHEDULE_CLASS_ACCOUNTS_QUERY, GET_SINGLE_SCHEDULE_CLASS_ACCOUNTS_QUERY, UPDATE_SCHEDULE_CLASS_INSTRUCTOR } from './queries'
import { SCHEDULE_CLASS_INSTRUCTOR_SCHEMA } from './yupSchema'
import ScheduleClassInstructorForm from './ScheduleClassInstructorForm'
import { dateToLocalISO } from '../../../../../tools/date_tools'

import ClassEditBase from "../ClassEditBase"
import ScheduleClassInstructorBack from "./ScheduleClassInstructorBack"
import { Card } from 'tabler-react';


function ScheduleClassInstructorEdit({ t, match, history }) {
  const id = match.params.id
  const classId = match.params.class_id
  const returnUrl = `/schedule/classes/all/instructors/${classId}`
  const cardTitle = t('schedule.classes.instructors.title_edit')
  const menuActiveLink = "instructors"
  const pageHeaderButtonList = <ScheduleClassInstructorBack classId={classId} />

  const {loading, error, data} = useQuery(GET_SINGLE_SCHEDULE_CLASS_ACCOUNTS_QUERY, {
    variables: { id: id },
    fetchPolicy: "network-only"
  })
  const [updateScheduleClassInstructor] = useMutation(UPDATE_SCHEDULE_CLASS_INSTRUCTOR)

  if (loading) return (
    <ClassEditBase
      cardTitle={cardTitle}
      menuActiveLink={menuActiveLink}
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <Card.Body>
        <p>{t('general.loading_with_dots')}</p>
      </Card.Body>
    </ClassEditBase>
  )

  if (error) return (
    <ClassEditBase
      cardTitle={cardTitle}
      menuActiveLink={menuActiveLink}
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <Card.Body>
        <p>{t('general.error_sad_smiley')}</p>
      </Card.Body>
    </ClassEditBase>
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
    <ClassEditBase 
      cardTitle={cardTitle}
      menuActiveLink="instructors"
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <Formik
        initialValues={{  
          dateStart: dateStart,
          dateEnd: dateEnd,
          account: initialData.account.id,
          role: initialData.role,
          account2: initialAccount2,
          role2: initialData.role2,
        }}
        validationSchema={SCHEDULE_CLASS_INSTRUCTOR_SCHEMA}
        onSubmit={(values, { setSubmitting }) => {

            let dateEnd
            if (values.dateEnd) {
              dateEnd = dateToLocalISO(values.dateEnd)
            } else {
              dateEnd = values.dateEnd
            }

            updateScheduleClassInstructor({ variables: {
              input: {
                id: match.params.id,
                account: values.account,
                role: values.role,
                account2: values.account2,
                role2: values.role2,
                dateStart: dateToLocalISO(values.dateStart),
                dateEnd: dateEnd
              }
            }, refetchQueries: [
                {query: GET_SCHEDULE_CLASS_ACCOUNTS_QUERY, variables: { scheduleItem: match.params.class_id }},
                // {query: GET_SUBSCRIPTIONS_QUERY, variables: {"archived": false }},
            ]})
            .then(({ data }) => {
                console.log('got data', data);
                history.push(returnUrl)
                toast.success((t('schedule.classes.instructors.toast_edit_success')), {
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
          <ScheduleClassInstructorForm
            inputData={inputData}
            isSubmitting={isSubmitting}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
            errors={errors}
            values={values}
            returnUrl={returnUrl}
          >
            {console.log(errors)}
          </ScheduleClassInstructorForm>
        )}
      </Formik>
    </ClassEditBase>
  )
}


export default withTranslation()(withRouter(ScheduleClassInstructorEdit))