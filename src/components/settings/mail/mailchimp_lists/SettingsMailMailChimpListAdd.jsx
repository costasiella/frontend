import React from 'react'
import { useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'


import { GET_MAILCHIMP_LISTS_QUERY, ADD_MAILCHIMP_LIST } from './queries'
// import { LEVEL_SCHEMA } from './yupSchema'
import SettingsMailMailChimpListForm from './SettingsMailMailChimpListForm'


import {
  Card,
} from "tabler-react"

import SettingsMailMailChimpListsBase from './SettingsMailMailChimpListsBase';


function SettingsMailMailChimpListAdd({t, history}) {
  const returnUrl = "/settings/mail/mailchimp_lists"
  const [ addMailChimpList ] = useMutation(ADD_MAILCHIMP_LIST)
  
  return (
   <SettingsMailMailChimpListsBase showBack={true}>
    <Card>
      <Card.Header>
        <Card.Title>{t('settings.mail.mailchimp_lists.title_add')}</Card.Title>
      </Card.Header>
      <Formik
          initialValues={{ name: '', description: '', frequency: '', mailchimpListId: '' }}
          // validationSchema={LEVEL_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              addMailChimpList({ variables: {
                input: {
                  name: values.name, 
                  description: values.description, 
                  frequency: values.frequency, 
                  mailchimpListId: values.mailchimpListId, 
                }
              }, refetchQueries: [
                  {query: GET_MAILCHIMP_LISTS_QUERY }
              ]})
              .then(({ data }) => {
                  console.log('got data', data);
                  history.push(returnUrl)
                  toast.success((t('settings.mail.mailchimp_lists.toast_add_success')), {
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
          {({ isSubmitting, setFieldTouched, setFieldValue, values, errors }) => (
            <SettingsMailMailChimpListForm 
              isSubmitting={isSubmitting}
              values={values}
              errors={errors}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
              returnUrl={returnUrl}
            />
          )}
      </Formik>
    </Card>
   </SettingsMailMailChimpListsBase> 
  )
}


export default withTranslation()(withRouter(SettingsMailMailChimpListAdd))