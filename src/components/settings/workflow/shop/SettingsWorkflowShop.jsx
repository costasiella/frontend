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

import SettingsBase from "../../SettingsBase"
import SettingsWorkflowShopForm from "./SettingsWorkflowShopForm"


function SettingsWorkflowShop({ t, match, history }) {
  const headerSubTitle = t('settings.workflow.title')
  const cardTitle = t("settings.workflow.shop.title")

  const { 
    loading: loadingSubscriptionPayment, 
    error: errorSubscriptionPayment, 
    data: dataSubscriptionPayment 
  } = useQuery(GET_SYSTEM_SETTINGS_QUERY, {
    variables: {
      setting: "workflow_shop_subscription_payment_method"
    }
  })
  const [ updateSettings ] = useMutation(UPDATE_SYSTEM_SETTING)

  if (loadingSubscriptionPayment) {
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
  if (errorSubscriptionPayment) {
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

  let initialValues = {
    workflow_shop_subscription_payment_method: "",
  }
  if (dataSubscriptionPayment.systemSettings.edges.length){
    initialValues['workflow_shop_subscription_payment_method'] = dataSubscriptionPayment.systemSettings.edges[0].node.value
  } 
    
  return (
    <SettingsBase 
      headerSubTitle={headerSubTitle}
      cardTitle={cardTitle}
    >  
    <Formik
      initialValues={{ 
        workflow_shop_subscription_payment_method: initialValues['workflow_shop_subscription_payment_method'],
      }}
      // validationSchema={MOLLIE_SCHEMA}
      onSubmit={(values, { setSubmitting }, errors) => {
          const settings = [
            { setting: "workflow_shop_subscription_payment_method", 
              value: values.workflow_shop_subscription_payment_method },
          ]

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
        <SettingsWorkflowShopForm
          isSubmitting={isSubmitting}
          errors={errors}
          values={values}
        >
          {console.log(errors)}
        </SettingsWorkflowShopForm>
      )}
      </Formik>
    </SettingsBase>
  )
}


export default withTranslation()(withRouter(SettingsWorkflowShop))