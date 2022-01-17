import React from 'react'
import { useMutation, useQuery } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { Dimmer } from 'tabler-react';

import { GET_ACCOUNT_SUBSCRIPTION_QUERY, GET_SCHEDULE_ITEM_ENROLLMENTS_QUERY, CREATE_SCHEDULE_ITEM_ENROLLMENT } from './queries'
import { SCHEDULE_CLASS_ENROLLMENT_SCHEMA } from './yupSchema'
import ScheduleClassEnrollmentForm from './ScheduleClassEnrollmentForm'
import { dateToLocalISO } from '../../../../../tools/date_tools'
import ButtonBack from '../../../../ui/ButtonBack';

import ClassEditBase from "../ClassEditBase"
import ScheduleClassEnrollmentBack from "./ScheduleClassEnrollmentBack"


function ScheduleClassEnrollmentAdd({ t, history, match }) {
  const accountId = match.params.account_id
  const classId = match.params.class_id
  const accountSubscriptionId = match.params.account_subscription_id
  const returnUrl = `/schedule/classes/all/enrollments/${classId}/options/${accountId}`
  const nextUrl = `/schedule/classes/all/enrollments/${classId}`
  let cardTitle = t('schedule.classes.enrollments.title_add')
  const menuActiveLink = "enrollments" 
  const pageHeaderButtonList = <ButtonBack returnUrl={returnUrl} />
  const { loading, error, data } = useQuery(GET_ACCOUNT_SUBSCRIPTION_QUERY, {
    variables: { id: accountSubscriptionId}
  })
  const [addScheduleClassEnrollment] = useMutation(CREATE_SCHEDULE_ITEM_ENROLLMENT)

  if (loading) return (
    <ClassEditBase
      cardTitle={cardTitle}
      menuActiveLink={menuActiveLink}
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <Dimmer loader={true} active={true} />
    </ClassEditBase>
  )

  if (error) return (
    <ClassEditBase
      cardTitle={cardTitle}
      menuActiveLink={menuActiveLink}
      pageHeaderButtonList={pageHeaderButtonList}
    >
      <p>{t('general.error_sad_smiley')}</p>
    </ClassEditBase>
  )

  const account = data.accountSubscription.account
  const accountSubscription = data.accountSubscription
  const using = t("general.using")
  cardTitle = `${cardTitle} ${account.fullName} ${using} ${accountSubscription.organizationSubscription.name}`
  
  // TODO: Add account subscription to sent values
  

  

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
        }}
        validationSchema={SCHEDULE_CLASS_ENROLLMENT_SCHEMA}
        onSubmit={(values, { setSubmitting }) => {

            let dateEnd
            if (values.dateEnd) {
              dateEnd = dateToLocalISO(values.dateEnd)
            } else {
              dateEnd = values.dateEnd
            }

            addScheduleClassEnrollment({ variables: {
              input: {
                scheduleItem: classId,
                accountSubscription: accountSubscriptionId,
                dateStart: dateToLocalISO(values.dateStart),
                dateEnd: dateEnd
              }
            }, refetchQueries: [
                {query: GET_SCHEDULE_ITEM_ENROLLMENTS_QUERY, variables: { scheduleItem: classId }},
                // {query: GET_SUBSCRIPTIONS_QUERY, variables: {"archived": false }},
            ]})
            .then(({ data }) => {
                console.log('got data', data);
                history.push(nextUrl)
                toast.success((t('schedule.classes.enrollments.toast_add_success')), {
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
          />
        )}
      </Formik>
    </ClassEditBase>
  )
}

export default withTranslation()(withRouter(ScheduleClassEnrollmentAdd))