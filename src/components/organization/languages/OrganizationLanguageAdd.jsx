// @flow

import React from 'react'
import { useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'


import { GET_LANGUAGES_QUERY, ADD_LANGUAGE } from './queries'
import { LANGUAGE_SCHEMA } from './yupSchema'
import OrganizationLanguageForm from './OrganizationLanguageForm'


import {
  Card,
} from "tabler-react"

import OrganizationLanguagesBase from './OrganizationLanguagesBase';


function OrganizationLanguageAdd({t, history}) {
  const returnUrl = "/organization/languages"
  const [ addLanguage ] = useMutation(ADD_LANGUAGE)
  
  return (
   <OrganizationLanguagesBase showBack={true}>
    <Card>
      <Card.Header>
        <Card.Title>{t('organization.languages.title_add')}</Card.Title>
      </Card.Header>
      <Formik
          initialValues={{ name: '', code: '' }}
          validationSchema={LANGUAGE_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              addLanguage({ variables: {
                input: {
                  name: values.name, 
                }
              }, refetchQueries: [
                  {query: GET_LANGUAGES_QUERY, variables: {"archived": false }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data);
                  history.push(returnUrl)
                  toast.success((t('organization.languages.toast_add_success')), {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                }).catch((error) => {
                  toast.error((t('general.toast_server_error')) +  error, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  console.log('there was an error sending the query', error)
                  setSubmitting(false)
                })
          }}
          >
          {({ isSubmitting, errors }) => (
            <OrganizationLanguageForm 
              isSubmitting={isSubmitting}
              errors={errors}
              returnUrl={returnUrl}
            />
          )}
      </Formik>
    </Card>
   </OrganizationLanguagesBase> 
  )
}


export default withTranslation()(withRouter(OrganizationLanguageAdd))