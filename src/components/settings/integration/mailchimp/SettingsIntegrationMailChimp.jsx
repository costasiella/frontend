import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import {
  Dimmer,
  Card,
} from "tabler-react";


import { GET_SYSTEM_SETTINGS_QUERY, UPDATE_SYSTEM_SETTING } from '../../queries'
import SettingsBase from "../../SettingsBase"
import SettingsIntegrationMailChimpForm from "./SettingsIntegrationMailChimpForm"
import SettingsIntegrationMollieCreateAccount from "./SettingsIntegrationMollieCreateAccount"


function SettingsIntegrationMailChimp({ t, match, history }) {
  const headerSubTitle = t('settings.integration.title')
  const cardTitle = t("settings.integration.mailchimp.title")
  const sidebarActive = "integration"

  const { 
    loading: loadingUser, 
    error: errorUser, 
    data: dataUser
  } = useQuery(GET_SYSTEM_SETTINGS_QUERY, {
    variables: {
      setting: "integration_mailchimp_user"
    }
  })
  const { 
    loading: loadingKey, 
    error: errorKey, 
    data: dataKey
  } = useQuery(GET_SYSTEM_SETTINGS_QUERY, {
    variables: {
      setting: "integration_mailchimp_api_key"
    }
  })

  const [ updateSettings ] = useMutation(UPDATE_SYSTEM_SETTING)

  console.log('query data app settings')
  console.log(dataUser)
  console.log(dataKey)

  if (loadingUser || loadingKey) {
    return (
      <SettingsBase 
          headerSubTitle={headerSubTitle}
          cardTitle={cardTitle}
          sidebarActive={sidebarActive}>  
        <Card.Body>
          <Dimmer active={true}
                  loader={true}>
          </Dimmer>
        </Card.Body>
      </SettingsBase>
    )
  }
  if (errorUser || errorKey) {
    return (
      <SettingsBase 
          headerSubTitle={headerSubTitle}
          cardTitle={cardTitle}
          sidebarActive={sidebarActive}>  
        <Card.Body>
          {t("settings.general.error_loading")}
        </Card.Body>
      </SettingsBase>
    )
  }

  let mcUser = ""
  if (dataUser.systemSettings.edges.length) {
    mcUser = data.systemSettings.edges[0].node.value
  }

  let mcApiKey = ""
  if (dataKey.systemSettings.edges.length) {
    mcApiKey = data.systemSettings.edges[0].node.value
  }

  return (
    <SettingsBase 
      headerSubTitle={headerSubTitle}
      cardTitle={cardTitle}
      sidebarActive={sidebarActive}
      alertBanner={<SettingsIntegrationMollieCreateAccount mollieApiKey={mollieApiKey} />}
    >
    <Formik
      initialValues={{ 
        mailchimpUser: mcUser,
        mailchimpAPIKey: mcApiKey
      }}
      // validationSchema={MOLLIE_SCHEMA}
      onSubmit={(values, { setSubmitting }, errors) => {
          console.log('submit values:')
          console.log(values)
          console.log(errors)

          const settings = [
            { setting: "integration_mailchimp_user", value: values.mailchimpUser },
            { setting: "integration_mailchimp_api_key", value: values.mailchimpAPIKey },
          ]

          for (let i in settings) {

            updateSettings({ variables: {
              input: {
                setting: settings[i].setting,
                value: settings[i].value,
              }
            }, refetchQueries: [
                {query: GET_SYSTEM_SETTINGS_QUERY, variables: { setting: i.setting }},
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
        <SettingsIntegrationMailChimpForm
          isSubmitting={isSubmitting}
          errors={errors}
          values={values}
        >
          {console.log(errors)}
        </SettingsIntegrationMailChimpForm>
      )}
      </Formik>
    </SettingsBase>
  )
}


export default withTranslation()(withRouter(SettingsIntegrationMailChimp))