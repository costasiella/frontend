import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_SYSTEM_MAIL_TEMPLATE_QUERY, GET_SYSTEM_MAIL_TEMPLATES_QUERY, UPDATE_SYSTEM_MAIL_TEMPLATE } from './queries'

import {
  Dimmer,
  Card,
} from "tabler-react";
import { getTemplateInfo } from './tools'

import SettingsMailTemplateEditBase from "./SettingsMailTemplateEditBase"
import SettingsMailTemplateEditForm from "./SettingsMailTemplateEditForm"


function SettingsMailTemplateEdit({ t, match, history }) {
  const id = match.params.id
  const returnUrl = "/settings/mail/templates"
  const headerSubTitle = t("settings.mail.templates.title")
  const cardTitle = t("settings.mail.templates.edit.title")

  const { loading, error, data } = useQuery(GET_SYSTEM_MAIL_TEMPLATE_QUERY, {
    variables: {
      id: id
    }
  })
  const [ updateSettings ] = useMutation(UPDATE_SYSTEM_MAIL_TEMPLATE)

  console.log('query data app settings')
  console.log(data)

  if (loading) {
    return (
      <SettingsMailTemplateEditBase 
          headerSubTitle={headerSubTitle}
          cardTitle={cardTitle}
      >  
        <Card.Body>
          <Dimmer active={true}
                  loader={true}>
          </Dimmer>
        </Card.Body>
      </SettingsMailTemplateEditBase>
    )
  }
  if (error) {
    return (
      <SettingsMailTemplateEditBase 
          headerSubTitle={headerSubTitle}
          cardTitle={cardTitle}
      >  
        <Card.Body>
          {t("settings.general.error_loading")}
        </Card.Body>
      </SettingsMailTemplateEditBase>
    )
  }

  const templateInfo = getTemplateInfo(t, data.systemMailTemplate.name)
  console.log(data.systemMailTemplate.name)
  console.log(templateInfo)


  return (
    <SettingsMailTemplateEditBase 
      headerSubTitle={headerSubTitle}
      help={templateInfo.helpTexts}
    >  
    <Formik
      initialValues={{ 
        subject: data.systemMailTemplate.subject,
        title: data.systemMailTemplate.title,
        description: data.systemMailTemplate.description,
        content: data.systemMailTemplate.content,
        comments: data.systemMailTemplate.comments        
      }}
      // validationSchema={MOLLIE_SCHEMA}
      onSubmit={(values, { setSubmitting }, errors) => {
          console.log('submit values:')
          console.log(values)
          console.log(errors)

          updateSettings({ variables: {
            input: {
              id: id,
              subject: values.subject,
              title: values.title,
              description: values.description,
              content: values.content,
              comments: values.comments
            }
          }, refetchQueries: [
              {query: GET_SYSTEM_MAIL_TEMPLATES_QUERY}
          ]})
          .then(({ data }) => {
              console.log('got data', data)
              toast.success((t('settings.mail.templates.edit.toast_edit_success')), {
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
        <SettingsMailTemplateEditForm
          isSubmitting={isSubmitting}
          errors={errors}
          values={values}
          setFieldTouched={setFieldTouched}
          setFieldValue={setFieldValue}
          cardTitle={templateInfo.cardTitle}
          returnUrl={returnUrl}
        >
          {console.log(errors)}
        </SettingsMailTemplateEditForm>
      )}
      </Formik>
    </SettingsMailTemplateEditBase>
  )
}


export default withTranslation()(withRouter(SettingsMailTemplateEdit))