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
import SettingsFinanceCurrencyForm from "./SettingsFinanceCurrencyForm"


function SettingsFinanceCurrency({ t, match, history }) {
  const headerSubTitle = t('settings.finance.title')
  const cardTitle = t("settings.finance.currency.title")
  const sidebarActive = "integration"

  const { 
    loading: loadingCurrency, 
    error: errorCurrency, 
    data: dataCurrency 
  } = useQuery(GET_SYSTEM_SETTINGS_QUERY, {
    variables: {
      setting: "finance_currency"
    }
  })
  const { 
    loading: loadingSymbol, 
    error: errorSymbol, 
    data: dataSymbol 
  } = useQuery(GET_SYSTEM_SETTINGS_QUERY, {
    variables: {
      setting: "finance_currency_symbol"
    }
  })
  const [ updateSettings ] = useMutation(UPDATE_SYSTEM_SETTING)

  if ((loadingCurrency) || (loadingSymbol)) {
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
  if ((errorCurrency) || errorSymbol) {
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

  let initialValues = {
    currency: "EUR",
    symbol: "€"
  }
  if (dataCurrency.systemSettings.edges.length){
    initialValues['currency'] = dataCurrency.systemSettings.edges[0].node.value
  } 
  if (dataSymbol.systemSettings.edges.length){
    initialValues['symbol'] = dataSymbol.systemSettings.edges[0].node.value
  } 
    


  return (
    <SettingsBase 
      headerSubTitle={headerSubTitle}
      cardTitle={cardTitle}
      sidebarActive={sidebarActive}
    >  
    <Formik
      initialValues={{ 
        finance_currency: initialValues['currency'],
        finance_currency_symbol: initialValues['symbol']
      }}
      // validationSchema={MOLLIE_SCHEMA}
      onSubmit={(values, { setSubmitting }, errors) => {
          const settings = [
            { setting: "finance_currency", value: values.finance_currency },
            { setting: "finance_currency_symbol", value: values.finance_currency_symbol },
          ]

          for (let i in settings) {

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
        <SettingsFinanceCurrencyForm
          isSubmitting={isSubmitting}
          errors={errors}
          values={values}
        >
          {console.log(errors)}
        </SettingsFinanceCurrencyForm>
      )}
      </Formik>
    </SettingsBase>
  )
}


export default withTranslation()(withRouter(SettingsFinanceCurrency))