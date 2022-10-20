import React from 'react'
import { useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'


import { GET_LEVELS_QUERY, ADD_LEVEL } from './queries'
import { LEVEL_SCHEMA } from './yupSchema'
import OrganizationLevelForm from './OrganizationLevelForm'


import {
  Card,
} from "tabler-react"

import OrganizationLevelsBase from './OrganizationLevelsBase';


function OrganizationLevelAdd({t, history}) {
  const returnUrl = "/organization/levels"
  const [ addLevel ] = useMutation(ADD_LEVEL)
  
  return (
   <OrganizationLevelsBase showBack={true}>
    <Card>
      <Card.Header>
        <Card.Title>{t('organization.levels.title_add')}</Card.Title>
      </Card.Header>
      <Formik
          initialValues={{ name: '', code: '' }}
          validationSchema={LEVEL_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              addLevel({ variables: {
                input: {
                  name: values.name, 
                }
              }, refetchQueries: [
                  {query: GET_LEVELS_QUERY, variables: {"archived": false }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data);
                  history.push(returnUrl)
                  toast.success((t('organization.levels.toast_add_success')), {
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


export default withTranslation()(withRouter(OrganizationLevelAdd))