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
import SettingsShopAccountProfileForm from "./SettingsShopAccountProfileForm"


function SettingsShopAccountProfile({ t, match, history }) {
  const headerSubTitle = t('settings.shop.title')
  const cardTitle = t("settings.shop.account_profiles.title")

  const { loading, error, data } = useQuery(GET_SYSTEM_SETTINGS_QUERY, {
    variables: {
      setting: "shop_account_profile_required_fields"
    }
  })
  const [ updateSettings ] = useMutation(UPDATE_SYSTEM_SETTING)

  if (loading) {
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
  if (error) {
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
    shop_account_profile_required_fields: "",
  }
  if (data.systemSettings.edges.length){
    initialValues['shop_account_profile_required_fields'] = data.systemSettings.edges[0].node.value
  } 
    
  return (
    <SettingsBase 
      headerSubTitle={headerSubTitle}
      cardTitle={cardTitle}
    >  
    <Formik
      initialValues={{ 
        shop_account_profile_required_fields: initialValues['shop_account_profile_required_fields'],
      }}
      // validationSchema={MOLLIE_SCHEMA}
      onSubmit={(values, { setSubmitting }, errors) => {
          const settings = [
            { setting: "shop_account_profile_required_fields", 
              value: values.shop_account_profile_required_fields },
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
        <SettingsShopAccountProfileForm
          isSubmitting={isSubmitting}
          errors={errors}
          values={values}
        >
          {console.log(errors)}
        </SettingsShopAccountProfileForm>
      )}
      </Formik>
    </SettingsBase>
  )
}


export default withTranslation()(withRouter(SettingsShopAccountProfile))