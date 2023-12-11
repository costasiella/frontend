import React from 'react'
import { gql } from "@apollo/client"
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_SCHEDULE_EVENTS_QUERY, GET_SCHEDULE_EVENT_QUERY } from '../queries'
import { SCHEDULE_EVENT_EDIT_SCHEMA } from '../yupSchema'


import {
  Dimmer,
  Card,
} from "tabler-react";

import ScheduleEventEditBase from "./ScheduleEventEditBase"
import ScheduleEventForm from "../ScheduleEventForm"
import { get_list_query_variables } from "../tools"


const UPDATE_SCHEDULE_EVENT = gql`
  mutation UpdateScheduleEvent($input: UpdateScheduleEventInput!) {
    updateScheduleEvent(input: $input) {
      scheduleEvent {
        id
        name
      }
    }
  }
`

function ScheduleEventEdit({t, match, history}) {
  const id = match.params.event_id
  const returnUrl = "/schedule/events"
  const activeLink = "general"

  const { loading, error, data } = useQuery(GET_SCHEDULE_EVENT_QUERY, {
    variables: { id: id },
    fetchPolicy: "network-only"
  })
  const [ updateScheduleEvent ] = useMutation(UPDATE_SCHEDULE_EVENT)


  if (loading) {
    return (
      <ScheduleEventEditBase activeLink={activeLink}>
        <Card.Body>
          <Dimmer loading={true} active={true} />
        </Card.Body>
      </ScheduleEventEditBase>
    )
  }

  if (error) {
    return (
      <ScheduleEventEditBase activeLink={activeLink}>
        <Card.Body>
          {t("schedule.events.error_loading")}
        </Card.Body>
      </ScheduleEventEditBase>
    )
  }

  const initialData = data.scheduleEvent
  const inputData = data

  let initialOrgranizationlevel = ""
  if (initialData.organizationLevel) {
    initialOrgranizationlevel = initialData.organizationLevel.id
  }

  let initialInstructor = ""
  if (initialData.instructor) {
    initialInstructor = initialData.instructor.id
  }

  let initialInstructor2 = ""
  if (initialData.instructor2) {
    initialInstructor2 = initialData.instructor2.id
  }

  return (
    <ScheduleEventEditBase activeLink={activeLink}>
        <Formik
          initialValues={{ 
            displayPublic: initialData.displayPublic,
            displayShop: initialData.displayShop,
            autoSendInfoMail: initialData.autoSendInfoMail,
            organizationLocation: initialData.organizationLocation.id,
            organizationLevel: initialOrgranizationlevel,
            name: initialData.name,
            tagline: initialData.tagline,
            preview: initialData.preview,
            description: initialData.description,
            instructor: initialInstructor,
            instructor2: initialInstructor2,
            infoMailContent: initialData.infoMailContent,
          }}
          validationSchema={SCHEDULE_EVENT_EDIT_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              console.log('submit values:')
              console.log(values)

              let inputValues = {
                id: id,
                displayPublic: values.displayPublic,
                displayShop: values.displayShop,
                autoSendInfoMail: values.autoSendInfoMail,
                organizationLocation: values.organizationLocation,
                organizationLevel: values.organizationLevel,
                name: values.name,
                tagline: values.tagline,
                preview: values.preview,
                description: values.description,
                infoMailContent: values.infoMailContent,
              }

              if (values.instructor) {
                inputValues['instructor'] = values.instructor
              }

              if (values.instructor2) {
                inputValues['instructor2'] = values.instructor2
              }

              updateScheduleEvent({ variables: {
                input: inputValues
              }, refetchQueries: [
                  { query: GET_SCHEDULE_EVENTS_QUERY, variables: get_list_query_variables() }
              ]})
              .then(({ data }) => {
                  console.log('got data', data)
                  toast.success((t('schedule.events.toast_edit_success')), {
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
          {({ isSubmitting, setFieldValue, setFieldTouched, errors, values }) => (
            <ScheduleEventForm
              inputData={inputData}
              isSubmitting={isSubmitting}
              setFieldValue={setFieldValue}
              setFieldTouched={setFieldTouched}
              errors={errors}
              values={values}
              returnUrl={returnUrl}
            />
          )}
        </Formik>
    </ScheduleEventEditBase>
  )
}

export default withTranslation()(withRouter(ScheduleEventEdit))