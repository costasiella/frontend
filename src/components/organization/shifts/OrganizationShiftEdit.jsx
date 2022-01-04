// @flow

import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_SHIFTS_QUERY, GET_SHIFT_QUERY, UPDATE_SHIFT } from './queries'
import { SHIFT_SCHEMA } from './yupSchema'
import OrganizationShiftForm from './OrganizationShiftForm'


import {
  Dimmer,
  Card,
} from "tabler-react";
import OrganizationShiftsBase from './OrganizationShiftsBase';
import ContentCard from "../../general/ContentCard"


function OrganizationShiftEdit({t, match, history}) {
  const id = match.params.id
  const cardTitle = t('organization.shifts.title_edit')
  const returnUrl = "/organization/shifts"
  const { loading, error, data } = useQuery(GET_SHIFT_QUERY, {
    variables: { id: id }
  })
  const [ updateShift ] = useMutation(UPDATE_SHIFT)

  if (loading) return (
    <OrganizationShiftsBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationShiftsBase>
  )

  if (error) return (
    <OrganizationShiftsBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('general.error_sad_smiley')}</p>
      </ContentCard>
    </OrganizationShiftsBase>
  )
                    
  const initialData = data.organizationShift;
  console.log('query data')
  console.log(data)

  return (
    <OrganizationShiftsBase showBack={true}>
      <Card title={cardTitle}>
        <Formik
            initialValues={{ 
              name: initialData.name, 
            }}
            validationSchema={SHIFT_SCHEMA}
            onSubmit={(values, { setSubmitting }) => {
                console.log('submit values:')
                console.log(values)

                updateShift({ variables: {
                  input: {
                    id: match.params.id,
                    name: values.name,
                  }
                }, refetchQueries: [
                    {query: GET_SHIFTS_QUERY, variables: {"archived": false }}
                ]})
                .then(({ data }) => {
                    console.log('got data', data)
                    history.push(returnUrl)
                    toast.success((t('organization.shifts.toast_edit_success')), {
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


export default withTranslation()(withRouter(OrganizationShiftEdit))