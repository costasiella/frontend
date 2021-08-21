// @flow

import React from 'react'
import { useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik, Form as FoForm, Field, ErrorMessage } from 'formik'
import { toast } from 'react-toastify'
import { Link } from "react-router-dom"


import { GET_DISCOVERIES_QUERY, ADD_DISCOVERY } from './queries'
import { DISCOVERY_SCHEMA } from './yupSchema'


import {
  Button,
  Card,
  Form,
} from "tabler-react"

import OrganizationDiscoveriesBase from './OrganizationDiscoveriesBase';


function OrganizationDiscoveryAdd({t, history}) {
  const returnUrl = "/organization/discoveries"
  const [ addDiscovery ] = useMutation(ADD_DISCOVERY)

  return (
    <OrganizationDiscoveriesBase showBack={true}>
      <Card title={t('organization.discoveries.title_add')}>
        <Formik
            initialValues={{ name: '', code: '' }}
            validationSchema={DISCOVERY_SCHEMA}
            onSubmit={(values, { setSubmitting }) => {
                addDiscovery({ variables: {
                  input: {
                    name: values.name, 
                  }
                }, refetchQueries: [
                    {query: GET_DISCOVERIES_QUERY, variables: {"archived": false }}
                ]})
                .then(({ data }) => {
                    console.log('got data', data);
                    history.push(returnUrl)
                    toast.success((t('organization.discoveries.toast_add_success')), {
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
            {({ isSubmitting, errors }) => (
                <FoForm>
                    <Card.Body>
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
    </OrganizationDiscoveriesBase>
  )
}


export default withTranslation()(withRouter(OrganizationDiscoveryAdd))