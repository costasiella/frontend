// @flow

import React from 'react'
import { useMutation, useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { Card } from 'tabler-react';

import { GET_SCHEDULE_CLASS_ACCOUNTS_QUERY, GET_INPUT_VALUES_QUERY, ADD_SCHEDULE_CLASS_INSTRUCTOR } from './queries'
import { SCHEDULE_CLASS_INSTRUCTOR_SCHEMA } from './yupSchema'
import ScheduleClassInstructorForm from './ScheduleClassInstructorForm'
import { dateToLocalISO } from '../../../../../tools/date_tools'

import ClassEditBase from "../ClassEditBase"
import ScheduleClassInstructorBack from "./ScheduleClassInstructorBack"


function ScheduleClassInstructorAdd({ t, history, match }) {
  const classId = match.params.class_id
  const returnUrl = `/schedule/classes/all/instructors/${classId}`
  const cardTitle = t('schedule.classes.instructors.title_add')
  const menuActiveLink = "instructors" 
  const pageHeaderButtonList = <ScheduleClassInstructorBack classId={classId} />

  const {loading, error, data} = useQuery(GET_INPUT_VALUES_QUERY, {
    fetchPolicy: "network-only"
  })
  const [addScheduleClassInstructor] = useMutation(ADD_SCHEDULE_CLASS_INSTRUCTOR)

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

  return (
    <ClassEditBase
      cardTitle={cardTitle}
      menuActiveLink={menuActiveLink}
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <Formik
        initialValues={{ 
          price: "", 
          dateStart: new Date() ,
          account: "",
          role: "",
          account2: "",
          role2: "",
        }}
        validationSchema={SCHEDULE_CLASS_INSTRUCTOR_SCHEMA}
        onSubmit={(values, { setSubmitting }) => {

            let dateEnd
            if (values.dateEnd) {
              dateEnd = dateToLocalISO(values.dateEnd)
            } else {
              dateEnd = values.dateEnd
            }

            addScheduleClassInstructor({ variables: {
              input: {
                scheduleItem: match.params.class_id,
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
                toast.success((t('schedule.classes.instructors.toast_add_success')), {
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
          />
        )}
      </Formik>
    </ClassEditBase>
  )
}

export default withTranslation()(withRouter(ScheduleClassInstructorAdd))