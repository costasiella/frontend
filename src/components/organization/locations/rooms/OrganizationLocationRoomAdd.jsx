import React from 'react'
import { useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import {
  Card,
} from "tabler-react"

import { GET_LOCATION_ROOMS_QUERY, ADD_LOCATION_ROOM } from './queries'
import { LOCATION_ROOM_SCHEMA } from './yupSchema'
import OrganizationLocationRoomForm from './OrganizationLocationRoomForm'
import OrganizationLocationRoomsBase from './OrganizationLocationRoomsBase';


function OrganizationLocationRoomAdd({ t, history, match }) {
  const locationId = match.params.location_id
  const returnUrl = `/organization/locations/rooms/${locationId}`
  const [ addLocationRoom ] = useMutation(ADD_LOCATION_ROOM)

  return (
    <OrganizationLocationRoomsBase showBack={true} returnUrl={returnUrl}>
      <Card title={t("organization.location_rooms.title_add")}>
        <Formik
          initialValues={{ name: '', displayPublic: true }}
          validationSchema={LOCATION_ROOM_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              addLocationRoom({ variables: {
                input: {
                  organizationLocation: locationId,
                  name: values.name, 
                  displayPublic: values.displayPublic
                }
              }, refetchQueries: [
                  {query: GET_LOCATION_ROOMS_QUERY,
                    variables: {"archived": false, "organizationLocation": locationId }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data);
                  history.push(returnUrl)
                  toast.success((t('organization.location_rooms.toast_add_success')), {
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

export default withTranslation()(withRouter(OrganizationLocationRoomAdd))