// @flow

import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_LEVELS_QUERY, GET_LEVEL_QUERY, UPDATE_LEVEL } from './queries'
import { LEVEL_SCHEMA } from './yupSchema'
import OrganizationLevelForm from './OrganizationLevelForm'


import {
  Dimmer,
  Card,
} from "tabler-react";
import OrganizationLevelsBase from './OrganizationLevelsBase';
import ContentCard from "../../general/ContentCard"


function OrganizationLevelEdit({t, match, history}) {
  const id = match.params.id
  const cardTitle = t('organization.levels.title_edit')
  const returnUrl = "/organization/levels"
  const { loading, error, data } = useQuery(GET_LEVEL_QUERY, {
    variables: { id: id }
  })
  const [ updateLevel ] = useMutation(UPDATE_LEVEL)

  if (loading) return (
    <OrganizationLevelsBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationLevelsBase>
  )

  if (error) return (
    <OrganizationLevelsBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('general.error_sad_smiley')}</p>
      </ContentCard>
    </OrganizationLevelsBase>
  )
                    
  const initialData = data.organizationLevel;
  console.log('query data')
  console.log(data)

  return (
    <OrganizationLevelsBase showBack={true}>
      <Card title={cardTitle}>
        <Formik
            initialValues={{ 
              name: initialData.name, 
            }}
            validationSchema={LEVEL_SCHEMA}
            onSubmit={(values, { setSubmitting }) => {
                console.log('submit values:')
                console.log(values)

                updateLevel({ variables: {
                  input: {
                    id: match.params.id,
                    name: values.name,
                  }
                }, refetchQueries: [
                    {query: GET_LEVELS_QUERY, variables: {"archived": false }}
                ]})
                .then(({ data }) => {
                    console.log('got data', data)
                    history.push(returnUrl)
                    toast.success((t('organization.levels.toast_edit_success')), {
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
              <OrganizationLevelForm 
                isSubmitting={isSubmitting}
                errors={errors}
                returnUrl={returnUrl}
              />
            )}
        </Formik>
      </Card>
    </OrganizationLevelsBase>
  )
}


export default withTranslation()(withRouter(OrganizationLevelEdit))