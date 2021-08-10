// @flow

import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { gql } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import {
  Dimmer,
} from "tabler-react";

import { GET_SCHEDULE_ITEM_PRICES_QUERY, GET_INPUT_VALUES_QUERY, ADD_SCHEDULE_ITEM_PRICE } from './queries'
import { SCHEDULE_CLASS_TEACHER_SCHEMA } from './yupSchema'
import ScheduleClassPriceForm from './ScheduleClassPriceForm'
import { dateToLocalISO } from '../../../../../tools/date_tools'

import ClassEditBase from "../ClassEditBase"
import ScheduleClassPriceBack from "./ScheduleClassPriceBack"


function ScheduleClassPriceAdd({ t, history, match }) {
  const classId = match.params.class_id
  const returnUrl = `/schedule/classes/all/prices/${classId}`
  const cardTitle = t('schedule.classes.prices.title_add')
  const menuActiveLink = "prices"
  const sidebarButton = <ScheduleClassPriceBack classId={classId} />
  const { loading, error, data, } = useQuery(GET_INPUT_VALUES_QUERY)
  const [addScheduleClassPrice] = useMutation(ADD_SCHEDULE_ITEM_PRICE, {
    onCompleted: () => history.push(returnUrl),
  })

  if (loading) return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      sidebarButton={sidebarButton}
    >
      <Dimmer active={true} loader={true} />
    </ClassEditBase>
  )
  // Error
  if (error) return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      sidebarButton={sidebarButton}
    >
      <p>{t('general.error_sad_smiley')}</p>
    </ClassEditBase>
  )

  console.log('query data')
  console.log(data)
  const inputData = data


  return (
    <ClassEditBase 
      menuActiveLink={menuActiveLink} 
      cardTitle={cardTitle} 
      sidebarButton={sidebarButton}
    >
      <Formik
        initialValues={{ 
          dateStart: new Date() ,
          organizationClasspassDropin: "",
          organizationClasspassTrial: "",
        }}
        // validationSchema={SCHEDULE_CLASS_TEACHER_SCHEMA}
        onSubmit={(values, { setSubmitting }) => {

            let dateEnd
            if (values.dateEnd) {
              dateEnd = dateToLocalISO(values.dateEnd)
            } else {
              dateEnd = values.dateEnd
            }

            addScheduleClassPrice({ variables: {
              input: {
                scheduleItem: match.params.class_id,
                dateStart: dateToLocalISO(values.dateStart),
                dateEnd: dateEnd,
                organizationClasspassDropin: values.organizationClasspassDropin,
                organizationClasspassTrial: values.organizationClasspassTrial
              }
            }, refetchQueries: [
                {query: GET_SCHEDULE_ITEM_PRICES_QUERY, variables: { scheduleItem: match.params.class_id }},
                // {query: GET_SUBSCRIPTIONS_QUERY, variables: {"archived": false }},
            ]})
            .then(({ data }) => {
                console.log('got data', data);
                toast.success((t('schedule.classes.prices.toast_add_success')), {
                    position: toast.POSITION.BOTTOM_RIGHT
                  })
              }).catch((error) => {
                toast.error((t('general.toast_server_error')) + ': ' +  error, {
                    position: toast.POSITION.BOTTOM_RIGHT
                  })
                console.log('there was an error sending the query', error)
                setSubmitting(false)
              })
        }}
        >
        {({ isSubmitting, errors, values, setFieldTouched, setFieldValue }) => (
          <ScheduleClassPriceForm
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

export default withTranslation()(withRouter(ScheduleClassPriceAdd))