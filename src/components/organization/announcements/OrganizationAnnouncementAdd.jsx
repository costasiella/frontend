import React from 'react'
import { useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'
import {
  Card,
} from "tabler-react"

import OrganizationAnnouncementsBase from './OrganizationAnnouncementsBase';
import { GET_ANNOUNCEMENTS_QUERY, ADD_ANNOUNCEMENT } from './queries'
import { ANNOUNCEMENT_SCHEMA } from './yupSchema'
import OrganizationAnnouncementForm from './OrganizationAnnouncementForm'
import { dateToLocalISO } from '../../../tools/date_tools'


function OrganizationAnnouncementAdd({t, history}) {
  const returnUrl = "/organization/announcements"
  const [addAnnouncement] = useMutation(ADD_ANNOUNCEMENT)
  
  return (
    <OrganizationAnnouncementsBase showEditBack={true}>
      <Card>
        <Card.Header>
          <Card.Title>{t('organization.announcements.title_add')}</Card.Title>
        </Card.Header>
        <Formik
            initialValues={{ 
              displayPublic: false,
              displayShop: false,
              displayBackend: false,
              title: '', 
              content: '',
              dateStart: new Date(),
              dateEnd: new Date(),
              priority: 100,
            }}
            validationSchema={ANNOUNCEMENT_SCHEMA}
            onSubmit={(values, { setSubmitting }) => {
              let inputValues = {
                displayPublic: values.displayPublic,
                displayBackend: values.displayBackend,
                displayShop: values.displayShop,
                title: values.title, 
                content: values.content,
                dateStart: dateToLocalISO(values.dateStart),
                dateEnd: dateToLocalISO(values.dateEnd),
                priority: parseInt(values.priority)
              }

              addAnnouncement({ variables: {
                input: inputValues
              }, refetchQueries: [
                  {query: GET_ANNOUNCEMENTS_QUERY}
              ]})
              .then(({ data }) => {
                  console.log('got data', data)
                  history.push(returnUrl)
                  toast.success((t('organization.announcements.toast_add_success')), {
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
            {({ isSubmitting, errors, values, setFieldTouched, setFieldValue }) => (
                <OrganizationAnnouncementForm 
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
    </OrganizationAnnouncementsBase>
  )
}


export default withTranslation()(withRouter(OrganizationAnnouncementAdd))