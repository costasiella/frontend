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
import SettingsIntegrationMollieForm from "./SettingsIntegrationMollieForm"
import SettingsIntegrationMollieCreateAccount from "./SettingsIntegrationMollieCreateAccount"


function SettingsIntegrationMollie({ t, match, history }) {
  const headerSubTitle = t('settings.integration.title')
  const cardTitle = t("settings.integration.mollie.title")
  const sidebarActive = "integration"

  const { loading, error, data } = useQuery(GET_SYSTEM_SETTINGS_QUERY, {
    variables: {
      setting: "integration_mollie_api_key"
    }
  })
  const [ updateSettings ] = useMutation(UPDATE_SYSTEM_SETTING)

  console.log('query data app settings')
  console.log(data)

  if (loading) {
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
  if (error) {
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

  let mollieApiKey = ""
  if (data.systemSettings.edges.length) {
    mollieApiKey = data.systemSettings.edges[0].node.value
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
        mollie_api_key: mollieApiKey
      }}
      // validationSchema={MOLLIE_SCHEMA}
      onSubmit={(values, { setSubmitting }, errors) => {
          console.log('submit values:')
          console.log(values)
          console.log(errors)

          updateSettings({ variables: {
            input: {
              setting: "integration_mollie_api_key",
              value: values.mollie_api_key
            }
          }, refetchQueries: [
              {query: GET_SYSTEM_SETTINGS_QUERY,     variables: {
                setting: "integration_mollie_api_key"
              }}
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
      }}
    >
      {({ isSubmitting, errors, values }) => (
        <SettingsIntegrationMollieForm
          isSubmitting={isSubmitting}
          errors={errors}
          values={values}
        >
          {console.log(errors)}
        </SettingsIntegrationMollieForm>
      )}
      </Formik>
    </SettingsBase>
  )
}


export default withTranslation()(withRouter(SettingsIntegrationMollie))