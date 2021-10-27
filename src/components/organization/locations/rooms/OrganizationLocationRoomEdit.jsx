// @flow

import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik, Form as FoForm, Field, ErrorMessage } from 'formik'
import { toast } from 'react-toastify'

import { GET_LOCATION_ROOMS_QUERY, GET_LOCATION_ROOM_QUERY, UPDATE_LOCATION_ROOM } from './queries'
import { LOCATION_ROOM_SCHEMA } from './yupSchema'
import OrganizationLocationRoomForm from './OrganizationLocationRoomForm'

import {
  Card,
  Dimmer
} from "tabler-react";

import ContentCard from "../../../general/ContentCard"
import OrganizationLocationRoomsBase from './OrganizationLocationRoomsBase'


function OrganizationLocationRoomEdit({t, history, match}) {
  const id = match.params.id
  const locationId = match.params.location_id
  const returnUrl = `/organization/locations/rooms/${locationId}`
  const cardTitle = t('organization.location_rooms.title_edit')
  const { loading, error, data } = useQuery(GET_LOCATION_ROOM_QUERY, {
    variables: { id: id }
  })
  const [ updateLocationRoom ] = useMutation(UPDATE_LOCATION_ROOM)

  // Loading
  if (loading) return (
    <OrganizationLocationRoomsBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationLocationRoomsBase>
  )
  // Error
  if (error) return (
    <OrganizationLocationRoomsBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('general.error_sad_smiley')}</p>
      </ContentCard>
    </OrganizationLocationRoomsBase>
  )

  const initialData = data.organizationLocationRoom;
  console.log('query data')
  console.log(data)

  return (
    <OrganizationLocationRoomsBase showBack={true}>
      <Card title={cardTitle}>
        <Formik
          initialValues={{ 
            name: initialData.name, 
            displayPublic: initialData.displayPublic 
          }}
          validationSchema={LOCATION_ROOM_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              console.log('submit values:')
              console.log(values)

              updateLocationRoom({ variables: {
                input: {
                  id: match.params.id,
                  name: values.name,
                  displayPublic: values.displayPublic 
                }
              }, refetchQueries: [
                {query: GET_LOCATION_ROOMS_QUERY,
                  variables: {"archived": false, "organizationLocation": match.params.location_id }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data)
                  history.push(returnUrl)
                  toast.success((t('organization.location_rooms.toast_edit_success')), {
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
          {({ isSubmitting, errors, values }) => (
            <OrganizationLocationRoomForm
            isSubmitting={isSubmitting}
            errors={errors}
            values={values}
            returnUrl={returnUrl}
            />
          )}
        </Formik>
      </Card>
    </OrganizationLocationRoomsBase>
  )
}


export default withTranslation()(withRouter(OrganizationLocationRoomEdit))