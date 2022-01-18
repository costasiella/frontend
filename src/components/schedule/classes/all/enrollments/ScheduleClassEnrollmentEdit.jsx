import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_SCHEDULE_ITEM_ENROLLMENTS_QUERY, GET_SCHEDULE_ITEM_ENROLLMENT_QUERY, UPDATE_SCHEDULE_ITEM_ENROLLMENT } from './queries'
import { SCHEDULE_CLASS_ENROLLMENT_SCHEMA } from './yupSchema'
import ScheduleClassEnrollmentForm from './ScheduleClassEnrollmentForm'
import { dateToLocalISO } from '../../../../../tools/date_tools'

import ClassEditBase from "../ClassEditBase"
import ScheduleClassEnrollmentBack from "./ScheduleClassEnrollmentBack"
import { Card } from 'tabler-react';


function ScheduleClassEnrollmentEdit({ t, match, history }) {
  const id = match.params.id
  const classId = match.params.class_id
  const returnUrl = `/schedule/classes/all/enrollments/${classId}`
  let cardTitle = t('schedule.classes.enrollments.title_edit')
  const menuActiveLink = "enrollments"
  const pageHeaderButtonList = <ScheduleClassEnrollmentBack classId={classId} />

  const {loading, error, data} = useQuery(GET_SCHEDULE_ITEM_ENROLLMENT_QUERY, {
    variables: { id: id }
  })
  const [updateScheduleClassEnrollment] = useMutation(UPDATE_SCHEDULE_ITEM_ENROLLMENT)

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
  const using = t("general.using")
  cardTitle = `
    ${cardTitle}  
    ${data.scheduleItemEnrollment.accountSubscription.account.fullName} 
    ${using} 
    ${data.scheduleItemEnrollment.accountSubscription.organizationSubscription.name}
  `

  const scheduleItemEnrollment = data.scheduleItemEnrollment
  // DatePicker doesn't like a string as an initial value
  // This makes it a happy DatePicker :)
  let dateStart = null
  if (scheduleItemEnrollment.dateStart) {
    dateStart = new Date(scheduleItemEnrollment.dateStart)
  }
  
  let dateEnd = null
  if (scheduleItemEnrollment.dateEnd) {
    dateEnd = new Date(scheduleItemEnrollment.dateEnd)
  }

  return (
    <ClassEditBase 
      cardTitle={cardTitle}
      menuActiveLink="enrollments"
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <Formik
        initialValues={{  
          dateStart: dateStart,
          dateEnd: dateEnd,
        }}
        validationSchema={SCHEDULE_CLASS_ENROLLMENT_SCHEMA}
        onSubmit={(values, { setSubmitting }) => {

            let dateEnd
            if (values.dateEnd) {
              dateEnd = dateToLocalISO(values.dateEnd)
            } else {
              dateEnd = values.dateEnd
            }

            updateScheduleClassEnrollment({ variables: {
              input: {
                id: match.params.id,
                dateStart: dateToLocalISO(values.dateStart),
                dateEnd: dateEnd
              }
            }, refetchQueries: [
                {query: GET_SCHEDULE_ITEM_ENROLLMENTS_QUERY, variables: { scheduleItem: match.params.class_id }},
            ]})
            .then(({ data }) => {
                console.log('got data', data);
                history.push(returnUrl)
                toast.success((t('schedule.classes.enrollments.toast_edit_success')), {
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
          <ScheduleClassEnrollmentForm
            isSubmitting={isSubmitting}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
            errors={errors}
            values={values}
            returnUrl={returnUrl}
          >
            {console.log(errors)}
          </ScheduleClassEnrollmentForm>
        )}
      </Formik>
    </ClassEditBase>
  )
}


export default withTranslation()(withRouter(ScheduleClassEnrollmentEdit))