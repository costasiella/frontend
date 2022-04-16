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
import SettingsFinanceBankAccountsForm from "./SettingsFinanceBankAccountsForm"


function SettingsFinanceIBAN({ t, match, history }) {
  const headerSubTitle = t('settings.finance.title')
  const cardTitle = t("settings.finance.bank_accounts.title")

  const { loading, error, data } = useQuery(GET_SYSTEM_SETTINGS_QUERY, {
    variables: {
      setting: "finance_bank_accounts_iban"
    },
    // fetchPolicy: "network-only"
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
    iban: false
  }
  if (data.systemSettings.edges.length){
    initialValues['iban'] = (data.systemSettings.edges[0].node.value.toLowerCase() === 'true')
  } 
    
  return (
    <SettingsBase 
      headerSubTitle={headerSubTitle}
      cardTitle={cardTitle}
    >  
    <Formik
      initialValues={{ 
        finance_bank_accounts_iban: initialValues['iban'],
      }}
      // validationSchema={MOLLIE_SCHEMA}
      onSubmit={(values, { setSubmitting }, errors) => {
          const settings = [
            { setting: "finance_bank_accounts_iban", value: values.finance_bank_accounts_iban },
          ]

          for (let i in settings) {
            updateSettings({ variables: {
              input: {
                setting: settings[i].setting,
                value: settings[i].value.toString(),
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
        <SettingsFinanceBankAccountsForm
          isSubmitting={isSubmitting}
          errors={errors}
          values={values}
        >
          {console.log(errors)}
        </SettingsFinanceBankAccountsForm>
      )}
      </Formik>
    </SettingsBase>
  )
}


export default withTranslation()(withRouter(SettingsFinanceIBAN))