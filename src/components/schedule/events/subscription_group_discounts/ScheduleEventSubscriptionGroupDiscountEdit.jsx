import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import { Dimmer } from 'tabler-react'

import { 
  GET_SCHEDULE_EVENT_SUBSCRIPTION_GROUP_DISCOUNTS_QUERY, 
  GET_SCHEDULE_EVENT_SUBSCRIPTION_GROUP_DISCOUNT_QUERY,
  UPDATE_SCHEDULE_EVENT_SUBSCRIPTION_GROUP_DISCOUNT
 } from "./queries"
// import { SCHEDULE_EVENT_EARLYBIRDS_SCHEMA } from './yupSchema'

import ScheduleEventEditBase from "../edit/ScheduleEventEditBase"
import ScheduleEventSubscriptionGroupDiscountForm from "./ScheduleEventSubscriptionGroupDiscountForm"


function ScheduleEventSubscriptionGroupEdit({ t, history, match }) {
  const eventId = match.params.event_id
  const scheduleEventSubscriptionGroupDiscountId = match.params.id
  const returnUrl = `/schedule/events/edit/${eventId}/subscription_group_discounts/`
  const activeLink = 'subscription_group_discounts'
  const cardTitle = t("schedule.events.subscription_group_discounts.edit")

  const [updateScheduleEventSubscriptionGroupDiscount] = useMutation(UPDATE_SCHEDULE_EVENT_SUBSCRIPTION_GROUP_DISCOUNT)
  const { loading, error, data } = useQuery(GET_SCHEDULE_EVENT_SUBSCRIPTION_GROUP_DISCOUNT_QUERY, {
    variables: {
      id: scheduleEventSubscriptionGroupDiscountId
  }})

  if (loading) return (
    <ScheduleEventEditBase 
      cardTitle={cardTitle} 
      activeLink={activeLink} 
      returnUrl={returnUrl}
    >
      <Dimmer active={true} loader={true} />
    </ScheduleEventEditBase>
  )
  if (error) return (
    <ScheduleEventEditBase 
      cardTitle={cardTitle} 
      activeLink={activeLink} 
      returnUrl={returnUrl}
    >
      <p>{t('general.error_sad_smiley')}</p>
      <p>{error.message}</p>
    </ScheduleEventEditBase>
  )

  const scheduleEventSubscriptionGroupDiscount = data.scheduleEventSubscriptionGroupDiscount


  return (
    <ScheduleEventEditBase 
      cardTitle={cardTitle} 
      activeLink={activeLink} 
      returnUrl={returnUrl}
    >
      <Formik
        initialValues={{ 
          organizationSubscriptionGroup: scheduleEventSubscriptionGroupDiscount.organizationSubscriptionGroup.id,
          discountPercentage: scheduleEventSubscriptionGroupDiscount.discountPercentage
        }}
        // validationSchema={SCHEDULE_EVENT_EARLYBIRDS_SCHEMA}
        onSubmit={(values, { setSubmitting }) => {
          console.log("Submit values")
          console.log(values)

          updateScheduleEventSubscriptionGroupDiscount({ variables: {
            input: {
              id: scheduleEventSubscriptionGroupDiscountId,
              organizationSubscriptionGroup: values.organizationSubscriptionGroup,
              discountPercentage: values.discountPercentage   
            }
          }, refetchQueries: [
              {query: GET_SCHEDULE_EVENT_SUBSCRIPTION_GROUP_DISCOUNTS_QUERY, variables: {scheduleEvent: eventId}}
          ]})
          .then(({ data }) => {
              console.log('got data', data);
              history.push(returnUrl)
              toast.success((t('schedule.events.subscription_group_discounts.toast_edit_success')), {
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
          <ScheduleEventSubscriptionGroupDiscountForm
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


export default withTranslation()(withRouter(ScheduleEventSubscriptionGroupEdit))