import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_LANGUAGES_QUERY, GET_LANGUAGE_QUERY, UPDATE_LANGUAGE } from './queries'
import { LANGUAGE_SCHEMA } from './yupSchema'
import OrganizationLanguageForm from './OrganizationLanguageForm'

import {
  Dimmer,
  Card,
} from "tabler-react";
import OrganizationLanguagesBase from './OrganizationLanguagesBase';
import ContentCard from "../../general/ContentCard"


function OrganizationLanguageEdit({t, match, history}) {
  const id = match.params.id
  const cardTitle = t('organization.languages.title_edit')
  const returnUrl = "/organization/languages"
  const { loading, error, data } = useQuery(GET_LANGUAGE_QUERY, {
    variables: { id: id }
  })
  const [ updateLanguage ] = useMutation(UPDATE_LANGUAGE)

  if (loading) return (
    <OrganizationLanguagesBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationLanguagesBase>
  )

  if (error) return (
    <OrganizationLanguagesBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('general.error_sad_smiley')}</p>
      </ContentCard>
    </OrganizationLanguagesBase>
  )
                    
  const initialData = data.organizationLanguage;
  console.log('query data')
  console.log(data)

  return (
    <OrganizationLanguagesBase showBack={true}>
      <Card title={cardTitle}>
        <Formik
            initialValues={{ 
              name: initialData.name, 
            }}
            validationSchema={LANGUAGE_SCHEMA}
            onSubmit={(values, { setSubmitting }) => {
                console.log('submit values:')
                console.log(values)

                updateLanguage({ variables: {
                  input: {
                    id: match.params.id,
                    name: values.name,
                  }
                }, refetchQueries: [
                    {query: GET_LANGUAGES_QUERY, variables: {"archived": false }}
                ]})
                .then(({ data }) => {
                    console.log('got data', data)
                    history.push(returnUrl)
                    toast.success((t('organization.languages.toast_edit_success')), {
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


export default withTranslation()(withRouter(OrganizationLanguageEdit))