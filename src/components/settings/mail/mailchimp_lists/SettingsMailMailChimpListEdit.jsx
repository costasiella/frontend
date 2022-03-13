import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_MAILCHIMP_LISTS_QUERY, GET_MAILCHIMP_LIST_QUERY, UPDATE_MAILCHIMP_LIST } from './queries'
import { MAILCHIMP_LIST_SCHEMA } from './yupSchema'
import SettingsMailMailChimpListForm from './SettingsMailMailChimpListForm'


import {
  Dimmer,
  Card,
} from "tabler-react";
import SettingsMailMailChimpListsBase from './SettingsMailMailChimpListsBase';
import ContentCard from "../../../general/ContentCard"


function SettingsMailMailChimpListEdit({t, match, history}) {
  const id = match.params.id
  const returnUrl = "/settings/mail/mailchimp_lists"
  const cardTitle = t('settings.mail.mailchimp_lists.title_edit')
  const { loading, error, data } = useQuery(GET_MAILCHIMP_LIST_QUERY, {
    variables: { id: id }
  })
  const [ updateMailchimpList ] = useMutation(UPDATE_MAILCHIMP_LIST)

  if (loading) return (
    <SettingsMailMailChimpListsBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </SettingsMailMailChimpListsBase>
  )

  if (error) return (
    <SettingsMailMailChimpListsBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('general.error_sad_smiley')}</p>
      </ContentCard>
    </SettingsMailMailChimpListsBase>
  )
                    
  const initialData = data.systemMailchimpList;
  console.log('query data')
  console.log(data)

  return (
    <SettingsMailMailChimpListsBase showBack={true}>
      <Card title={cardTitle}>
        <Formik
            initialValues={{ 
              name: initialData.name, 
              description: initialData.description, 
              frequency: initialData.frequency, 
              mailchimpListId: initialData.mailchimpListId, 
            }}
            validationSchema={MAILCHIMP_LIST_SCHEMA}
            onSubmit={(values, { setSubmitting }) => {
                console.log('submit values:')
                console.log(values)

                updateMailchimpList({ variables: {
                  input: {
                    id: match.params.id,
                    name: values.name, 
                    description: values.description, 
                    frequency: values.frequency, 
                    mailchimpListId: values.mailchimpListId, 
                  }
                }, refetchQueries: [
                    {query: GET_MAILCHIMP_LISTS_QUERY}
                ]})
                .then(({ data }) => {
                    console.log('got data', data)
                    history.push(returnUrl)
                    toast.success((t('settings.mail.mailchimp_lists.toast_edit_success')), {
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


export default withTranslation()(withRouter(SettingsMailMailChimpListEdit))