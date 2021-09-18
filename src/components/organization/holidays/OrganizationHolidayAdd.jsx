// @flow

import React from 'react'
import { useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import {
  Card,
} from "tabler-react"

import { dateToLocalISO } from "../../../tools/date_tools"

import { GET_HOLIDAYS_QUERY, ADD_HOLIDAY } from './queries'
import { HOLIDAY_SCHEMA } from './yupSchema'
import OrganizationHolidayForm from './OrganizationHolidayForm'
import OrganizationHolidaysBase from './OrganizationHolidaysBase';


function OrganizationHolidayAdd({t, history}) {
  const returnUrl = "/organization/holidays"
  const [ addHoliday ] = useMutation(ADD_HOLIDAY)
  
  return (
   <OrganizationHolidaysBase showBack={true}>
    <Card>
      <Card.Header>
        <Card.Title>{t('organization.holidays.title_add')}</Card.Title>
      </Card.Header>
      <Formik
          initialValues={{ name: '', description: '', classes: true }}
          validationSchema={HOLIDAY_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              addHoliday({ variables: {
                input: {
                  name: values.name, 
                  dateStart: dateToLocalISO(values.dateStart),
                  dateEnd: dateToLocalISO(values.dateEnd),
                  description: values.description,
                  classes: values.classes,
                }
              }, refetchQueries: [
                  {query: GET_HOLIDAYS_QUERY, variables: {"archived": false }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data);
                  history.push(returnUrl)
                  toast.success((t('organization.holidays.toast_add_success')), {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                }).catch((error) => {
                  toast.error((t('general.toast_server_error')) + ': ' +  error, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  console.log('there was an error sending the query', error)
                  setSubmitting(false)
                })
          }}
          >
          {({ isSubmitting, values, errors, setFieldTouched, setFieldValue }) => (
            <OrganizationHolidayForm 
              isSubmitting={isSubmitting}
              errors={errors}
              values={values}
              setFieldTouched={setFieldTouched}
              setFieldValue={setFieldValue}
              returnUrl={returnUrl}
            />
          )}
      </Formik>
    </Card>
   </OrganizationHolidaysBase> 
  )
}


export default withTranslation()(withRouter(OrganizationHolidayAdd))