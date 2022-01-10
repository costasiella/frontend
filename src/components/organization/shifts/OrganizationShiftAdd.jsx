// @flow

import React from 'react'
import { useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'


import { GET_SHIFTS_QUERY, ADD_SHIFT } from './queries'
import { SHIFT_SCHEMA } from './yupSchema'
import OrganizationShiftForm from './OrganizationShiftForm'


import {
  Card,
} from "tabler-react"

import OrganizationShiftsBase from './OrganizationShiftsBase';


function OrganizationShiftAdd({t, history}) {
  const returnUrl = "/organization/shifts"
  const [ addShift ] = useMutation(ADD_SHIFT)
  
  return (
   <OrganizationShiftsBase showBack={true}>
    <Card>
      <Card.Header>
        <Card.Title>{t('organization.shifts.title_add')}</Card.Title>
      </Card.Header>
      <Formik
          initialValues={{ name: '' }}
          validationSchema={SHIFT_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              addShift({ variables: {
                input: {
                  name: values.name, 
                }
              }, refetchQueries: [
                  {query: GET_SHIFTS_QUERY, variables: {"archived": false }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data);
                  history.push(returnUrl)
                  toast.success((t('organization.shifts.toast_add_success')), {
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
            <OrganizationShiftForm 
              isSubmitting={isSubmitting}
              errors={errors}
              returnUrl={returnUrl}
            />
          )}
      </Formik>
    </Card>
   </OrganizationShiftsBase> 
  )
}


export default withTranslation()(withRouter(OrganizationShiftAdd))