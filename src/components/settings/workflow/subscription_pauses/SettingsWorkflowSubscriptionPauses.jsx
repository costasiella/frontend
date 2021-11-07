// @flow

import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_SYSTEM_SETTINGS_QUERY, UPDATE_SYSTEM_SETTING } from '../../queries'

import {
  Dimmer,
  Card,
} from "tabler-react";
import HasPermissionWrapper from "../../../HasPermissionWrapper"

// import FinancePaymentMethodForm from './AppSettingsGeneralForm'
import SettingsBase from "../../SettingsBase"
import SettingsWorkflowSubscriptionPausesForm from "./SettingsWorkflowSubscriptionPausesForm"


function SettingsWorkflowSubscriptionPauses({ t, match, history }) {
  const headerSubTitle = t('settings.workflow.title')
  const cardTitle = t("settings.workflow.subscription_pauses.title")

  const { 
    loading: loadingMinDuration, 
    error: errorMinDuration, 
    data: dataMinDuration 
  } = useQuery(GET_SYSTEM_SETTINGS_QUERY, {
    variables: {
      setting: "workflow_subscription_pauses_min_duration_in_days"
    }
  })
  const { 
    loading: loadingMaxPauses, 
    error: errorMaxPauses, 
    data: dataMaxPauses 
  } = useQuery(GET_SYSTEM_SETTINGS_QUERY, {
    variables: {
      setting: "workflow_subscription_pauses_max_pauses_in_year"
    }
  })
  const [ updateSettings, { data: updateData }] = useMutation(UPDATE_SYSTEM_SETTING)

  if ((loadingMinDuration) || (loadingMaxPauses)) {
    return (
      <SettingsBase 
          headerSubTitle={headerSubTitle}
          cardTitle={cardTitle}
      >  
        <Card.Body>
          <Dimmer active={true}
                  loader={true}>
          </Dimmer>
        </Card.Body>
      </SettingsBase>
    )
  }
  if ((errorMinDuration) || errorMaxPauses) {
    return (
      <SettingsBase 
          headerSubTitle={headerSubTitle}
          cardTitle={cardTitle}
      >  
        <Card.Body>
          {t("settings.general.error_loading")}
        </Card.Body>
      </SettingsBase>
    )
  }

  console.log('query data app settings')
  console.log(dataMinDuration)
  console.log(dataMaxPauses)

  let initialValues = {
    workflow_subscription_pauses_min_duration_in_days: "1",
    workflow_subscription_pauses_max_pauses_in_year: "1"
  }

  if (dataMinDuration.systemSettings.edges.length){
    initialValues['workflow_subscription_pauses_min_duration_in_days'] = dataMinDuration.systemSettings.edges[0].node.value
  } 
  if (dataMaxPauses.systemSettings.edges.length){
    initialValues['workflow_subscription_pauses_max_pauses_in_year'] = dataMaxPauses.systemSettings.edges[0].node.value
  } 

  return (
    <SettingsBase 
      headerSubTitle={headerSubTitle}
      cardTitle={cardTitle}
    >  
    <Formik
      initialValues={{ 
        workflow_subscription_pauses_min_duration_in_days: initialValues['workflow_subscription_pauses_min_duration_in_days'],
        workflow_subscription_pauses_max_pauses_in_year: initialValues['workflow_subscription_pauses_max_pauses_in_year']
      }}
      // validationSchema={MOLLIE_SCHEMA}
      onSubmit={(values, { setSubmitting }, errors) => {
          console.log('submit values:')
          console.log(values)
          console.log(errors)

          const settings = [
            { setting: "workflow_subscription_pauses_min_duration_in_days", 
              value: values.workflow_subscription_pauses_min_duration_in_days },
            { setting: "workflow_subscription_pauses_max_pauses_in_year", 
              value: values.workflow_subscription_pauses_max_pauses_in_year },
          ]

          let error = false

          for (let i in settings) {

            console.log(i)
            console.log(settings[i].setting)
            console.log(settings[i].value)

            updateSettings({ variables: {
              input: {
                setting: settings[i].setting,
                value: settings[i].value,
              }
            }, refetchQueries: [
                {query: GET_SYSTEM_SETTINGS_QUERY, variables: { setting: settings[i].setting }},
            ]})
            .then(({ data }) => {
                console.log('got data', data)
                toast.success((t('settings.general.toast_edit_success')), {
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
          }
      }}
    >
      {({ isSubmitting, errors, values }) => (
        <SettingsWorkflowSubscriptionPausesForm
          isSubmitting={isSubmitting}
          errors={errors}
          values={values}
        >
          {console.log(errors)}
        </SettingsWorkflowSubscriptionPausesForm>
      )}
      </Formik>
    </SettingsBase>
  )
}


export default withTranslation()(withRouter(SettingsWorkflowSubscriptionPauses))