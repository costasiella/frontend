// @flow

import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_HOLIDAYS_QUERY, GET_HOLIDAY_QUERY, UPDATE_HOLIDAY } from './queries'
import { HOLIDAY_SCHEMA } from './yupSchema'
import OrganizationHolidayForm from './OrganizationHolidayForm'

import { dateToLocalISO } from "../../../tools/date_tools"

import {
  Dimmer,
  Card,
} from "tabler-react";
import OrganizationHolidaysBase from './OrganizationHolidaysBase';
import ContentCard from "../../general/ContentCard"


function OrganizationHolidayEdit({t, match, history}) {
  const id = match.params.id
  const cardTitle = t('organization.holidays.title_edit')
  const returnUrl = "/organization/holidays"
  const { loading, error, data } = useQuery(GET_HOLIDAY_QUERY, {
    variables: { id: id }
  })
  const [ updateHoliday ] = useMutation(UPDATE_HOLIDAY)

  if (loading) return (
    <OrganizationHolidaysBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationHolidaysBase>
  )

  if (error) return (
    <OrganizationHolidaysBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('general.error_sad_smiley')}</p>
      </ContentCard>
    </OrganizationHolidaysBase>
  )
                    
  const initialData = data.organizationHoliday;
  console.log('query data')
  console.log(data)

  // DatePicker doesn't like a string as an initial value
  // This makes it a happy DatePicker :)
  let dateStart = null
  if (initialData.dateStart) {
    dateStart = new Date(initialData.dateStart)
  }
  let dateEnd = null
  if (initialData.dateEnd) {
    dateEnd = new Date(initialData.dateEnd)
  }


  return (
    <OrganizationHolidaysBase showBack={true}>
      <Card title={cardTitle}>
        <Formik
            initialValues={{ 
              name: initialData.name, 
              description: initialData.description,
              dateStart: dateStart,
              dateEnd: dateEnd,
              classes: initialData.classes
            }}
            validationSchema={HOLIDAY_SCHEMA}
            onSubmit={(values, { setSubmitting }) => {
                console.log('submit values:')
                console.log(values)

                updateHoliday({ variables: {
                  input: {
                    id: match.params.id,
                    name: values.name,
                    description: values.description,
                    dateStart: dateToLocalISO(values.dateStart),
                    dateEnd: dateToLocalISO(values.dateEnd)
                  }
                }, refetchQueries: [
                    {query: GET_HOLIDAYS_QUERY}
                ]})
                .then(({ data }) => {
                    console.log('got data', data)
                    history.push(returnUrl)
                    toast.success((t('organization.holidays.toast_edit_success')), {
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


export default withTranslation()(withRouter(OrganizationHolidayEdit))