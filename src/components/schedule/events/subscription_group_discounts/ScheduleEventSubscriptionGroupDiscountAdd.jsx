import React from 'react'
import { useMutation, useQuery } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { 
  Card,
  Dimmer
} from 'tabler-react'

import { 
  ADD_SCHEDULE_EVENT_SUBSCRIPTION_GROUP_DISCOUNT, 
  GET_SCHEDULE_EVENT_SUBSCRIPTION_GROUP_DISCOUNTS_QUERY,
  GET_INPUT_VALUES_QUERY
} from "./queries"
import { SCHEDULE_EVENT_SUBSCRIPTION_GROUP_DISCOUNT_SCHEMA } from './yupSchema'

import ScheduleEventEditBase from "../edit/ScheduleEventEditBase"
import ScheduleEventEarlybirdForm from "./ScheduleEventSubscriptionGroupDiscountForm"



function ScheduleEventSubscriptionGroupDiscountAdd({ t, history, match }) {
  const eventId = match.params.event_id
  const returnUrl = `/schedule/events/edit/${eventId}/subscription_group_discounts/`
  const activeLink = 'earlybirds'
  const cardTitle = t("schedule.events.subscription_group_discounts.add")


  const { loading, error, data } = useQuery(GET_INPUT_VALUES_QUERY)
  const [addScheduleEventEarlybird] = useMutation(ADD_SCHEDULE_EVENT_SUBSCRIPTION_GROUP_DISCOUNT)

  if (loading) return (
    <ScheduleEventEditBase 
      cardTitle={cardTitle} 
      activeLink={activeLink} 
      returnUrl={returnUrl}
    >
      <Card.Body>
        <Dimmer loader={true} active={true} />
      </Card.Body>
    </ScheduleEventEditBase>
  )

  if (error) return (
    <ScheduleEventEditBase 
      cardTitle={cardTitle} 
      activeLink={activeLink} 
      returnUrl={returnUrl}
    >
      <Card.Body>
        <p>{t('general.error_sad_smiley')}</p>
        <p>{error.message}</p>
      </Card.Body>
    </ScheduleEventEditBase>
  )

  return (
    <ScheduleEventEditBase 
      cardTitle={cardTitle} 
      activeLink={activeLink} 
      returnUrl={returnUrl}
    >
      <Formik
        initialValues={{ 
          dateStart: new Date(),
          dateEnd: "",
          discountPercentage: 0,
        }}
        validationSchema={SCHEDULE_EVENT_SUBSCRIPTION_GROUP_DISCOUNT_SCHEMA}
        onSubmit={(values, { setSubmitting }) => {
          console.log("Submit values")
          console.log(values)

          addScheduleEventEarlybird({ variables: {
            input: {
              scheduleEvent: eventId,
              organizationSubscriptionGroup: values.organizationSubscriptionGroup,
              discountPercentage: values.discountPercentage   
            }
          }, refetchQueries: [
              {query: GET_SCHEDULE_EVENT_SUBSCRIPTION_GROUP_DISCOUNTS_QUERY, variables: {scheduleEvent: eventId}}
          ]})
          .then(({ data }) => {
              console.log('got data', data);
              history.push(returnUrl)
              toast.success((t('schedule.events.subscription_group_discounts.toast_add_success')), {
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
        {({ isSubmitting, errors, values, setFieldTouched, setFieldValue }) => (
          <ScheduleEventEarlybirdForm
            isSubmitting={isSubmitting}
            errors={errors}
            values={values}
            inputData={data}
            setFieldTouched={setFieldTouched}
            setFieldValue={setFieldValue}
            returnUrl={returnUrl}
          />
        )}
      </Formik>
    </ScheduleEventEditBase>
  )
}

export default withTranslation()(withRouter(ScheduleEventSubscriptionGroupDiscountAdd))