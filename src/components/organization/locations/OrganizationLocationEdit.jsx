// @flow

import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik, Form as FoForm, Field, ErrorMessage } from 'formik'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

import { GET_LOCATIONS_QUERY, GET_LOCATION_QUERY, UPDATE_LOCATION } from './queries'
import { LOCATION_SCHEMA } from './yupSchema'

import {
  Button,
  Card,
  Dimmer,
  Form
} from "tabler-react";

import ContentCard from "../../general/ContentCard"
import OrganizationLocationsBase from "./OrganizationLocationsBase"


function OrganizationLocationEdit({t, match, history}) {
  const id = match.params.id
  const cardTitle = t('organization.locations.title_edit')
  const returnUrl = "/organization/locations"
  const { loading, error, data } = useQuery(GET_LOCATION_QUERY, {
    variables: { id: id }
  })
  const [ updateLocation ] = useMutation(UPDATE_LOCATION)

  // Loading
  if (loading) return (
    <OrganizationLocationsBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationLocationsBase>
  )
  // Error
  if (error) return (
    <OrganizationLocationsBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('organization.locations.error_loading')}</p>
      </ContentCard>
    </OrganizationLocationsBase>
  )

  const initialData = data.organizationLocation;
  console.log('query data')
  console.log(data)

  return (
    <OrganizationLocationsBase showBack={true}>
      <Card>
        <Card.Header>
          <Card.Title>{cardTitle}</Card.Title>
          {console.log(match.params.id)}
        </Card.Header>                    
        <Formik
            initialValues={{ 
              name: initialData.name, 
              displayPublic: initialData.displayPublic 
            }}
            validationSchema={LOCATION_SCHEMA}
            onSubmit={(values, { setSubmitting }) => {
                console.log('submit values:')
                console.log(values)

                updateLocation({ variables: {
                  input: {
                    id: match.params.id,
                    name: values.name,
                    displayPublic: values.displayPublic 
                  }
                }, refetchQueries: [
                    {query: GET_LOCATIONS_QUERY, variables: {"archived": false }}
                ]})
                .then(({ data }) => {
                    console.log('got data', data)
                    history.push(returnUrl)
                    toast.success((t('organization.locations.toast_edit_success')), {
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
            {({ isSubmitting, errors, values }) => (
              <FoForm>
                  <Card.Body>
                      <Form.Group>
                        <Form.Label className="custom-switch">
                          <Field 
                            className="custom-switch-input"
                            type="checkbox" 
                            name="displayPublic" 
                            checked={values.displayPublic} />
                          <span className="custom-switch-indicator" ></span>
                          <span className="custom-switch-description">{t('organization.location.public')}</span>
                        </Form.Label>
                        <ErrorMessage name="displayPublic" component="div" />   
                      </Form.Group>     
                      <Form.Group label={t('general.name')} >
                        <Field type="text" 
                              name="name" 
                              className={(errors.name) ? "form-control is-invalid" : "form-control"} 
                              autoComplete="off" />
                        <ErrorMessage name="name" component="span" className="invalid-feedback" />
                      </Form.Group>
                  </Card.Body>
                  <Card.Footer>
                      <Button 
                        className="pull-right"
                        color="primary"
                        disabled={isSubmitting}
                        type="submit"
                      >
                        {t('general.submit')}
                      </Button>
                      <Link to={returnUrl}>
                        <Button
                          type="button" 
                          color="link" 
                        >
                            {t('general.cancel')}
                        </Button>
                      </Link>
                    </Card.Footer>
                </FoForm>
              )}
            </Formik>
          </Card>
    </OrganizationLocationsBase>
  )
}


export default withTranslation()(withRouter(OrganizationLocationEdit))