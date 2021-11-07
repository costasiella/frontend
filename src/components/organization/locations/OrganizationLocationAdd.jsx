// @flow

import React from 'react'
import { useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik, Form as FoForm, Field, ErrorMessage } from 'formik'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

import { GET_LOCATIONS_QUERY, ADD_LOCATION } from './queries'
import { LOCATION_SCHEMA } from './yupSchema'

import {
  Button,
  Card,
  Form,
} from "tabler-react"

import OrganizationLocationsBase from "./OrganizationLocationsBase"

function OrganizationLocationAdd({ t, history }) {
  const returnUrl = "/organization/locations"
  const cardTitle = t('organization.locations.title_add')
  const [ addLocation ] = useMutation(ADD_LOCATION)

  return (
    <OrganizationLocationsBase showBack={true}>
      <Card>    
        <Card.Header>
          <Card.Title>{cardTitle}</Card.Title>
        </Card.Header>
        <Formik
          initialValues={{ name: '', displayPublic: true }}
          validationSchema={LOCATION_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              addLocation({ variables: {
                input: {
                  name: values.name, 
                  displayPublic: values.displayPublic
                }
              }, refetchQueries: [
                  {query: GET_LOCATIONS_QUERY, variables: {"archived": false }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data);
                  history.push(returnUrl)
                  toast.success((t('organization.locations.toast_add_success')), {
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

                    <Form.Group label={t('general.name')}>
                      <Field type="text" 
                              name="name" 
                              className={(errors.name) ? "form-control is-invalid" : "form-control"} 
                              autoComplete="off" />
                      <ErrorMessage name="name" component="span" className="invalid-feedback" />
                    </Form.Group>
                </Card.Body>
                <Card.Footer>
                    <Button 
                      color="primary"
                      className="pull-right" 
                      type="submit" 
                      disabled={isSubmitting}
                    >
                      {t('general.submit')}
                    </Button>
                    <Link to={returnUrl}>
                      <Button color="link">
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


export default withTranslation()(withRouter(OrganizationLocationAdd))