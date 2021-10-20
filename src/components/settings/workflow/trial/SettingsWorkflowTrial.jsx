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
import SettingsWorkflowTrialForm from "./SettingsWorkflowTrialForm"


function SettingsWorkflowClassBooking({ t, match, history }) {
  const headerSubTitle = t('settings.workflow.title')
  const cardTitle = t("settings.workflow.class_booking.title")

  const { 
    loading: loadingTrialClassLimit, 
    error: errorTrialClassLimit, 
    data: dataTrialClassLimit 
  } = useQuery(GET_SYSTEM_SETTINGS_QUERY, {
    variables: {
      setting: "workflow_trial_class_limit"
    }
  })
  const [ updateSettings, { data: updateData }] = useMutation(UPDATE_SYSTEM_SETTING)

  if (loadingTrialClassLimit) {
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
  if (errorTrialClassLimit) {
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
  console.log(dataTrialClassLimit)

  let initialValues = {
    workflow_trial_class_limit: "1",
  }
  if (dataTrialClassLimit.systemSettings.edges.length){
    initialValues['workflow_trial_class_limit'] = dataTrialClassLimit.systemSettings.edges[0].node.value
  } 
    
  return (
    <SettingsBase 
      headerSubTitle={headerSubTitle}
      cardTitle={cardTitle}
    >  
    <Formik
      initialValues={{ 
        workflow_trial_class_limit: initialValues['workflow_trial_class_limit'],
      }}
      // validationSchema={MOLLIE_SCHEMA}
      onSubmit={(values, { setSubmitting }, errors) => {
          console.log('submit values:')
          console.log(values)
          console.log(errors)

          const settings = [
            { setting: "workflow_trial_class_limit", value: values.workflow_trial_class_limit },
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
                toast.error((t('general.toast_server_error')) + ': ' +  error, {
                  position: toast.POSITION.BOTTOM_RIGHT
                })
                console.log('there was an error sending the query', error)
                setSubmitting(false)
              })
          }
      }}
    >
      {({ isSubmitting, errors, values }) => (
        <SettingsWorkflowTrialForm
          isSubmitting={isSubmitting}
          errors={errors}
          values={values}
        >
          {console.log(errors)}
        </SettingsWorkflowTrialForm>
      )}
      </Formik>
    </SettingsBase>
  )
}


export default withTranslation()(withRouter(SettingsWorkflowClassBooking))