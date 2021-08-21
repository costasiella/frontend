// @flow

import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik, Form as FoForm, Field, ErrorMessage } from 'formik'
import { toast } from 'react-toastify'
import { Link } from "react-router-dom"

import { GET_DISCOVERIES_QUERY, GET_DISCOVERY_QUERY, UPDATE_DISCOVERY } from './queries'
import { DISCOVERY_SCHEMA } from './yupSchema'

import {
  Dimmer,
  Button,
  Card,
  Form
} from "tabler-react";

import ContentCard from "../../general/ContentCard"
import OrganizationDiscoveriesBase from './OrganizationDiscoveriesBase';


function OrganizationDiscoveryEdit({t, history, match}) {
  const id = match.params.id
  const returnUrl = "/organization/discoveries"
  const cardTitle = t('organization.discoveries.title_edit')
  const { loading, error, data } = useQuery(GET_DISCOVERY_QUERY, {
    variables: {id: id}
  })
  const [ updateDiscovery ] = useMutation(UPDATE_DISCOVERY)

  if (loading) return (
    <OrganizationDiscoveriesBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationDiscoveriesBase>
  )

  if (error) return (
    <OrganizationDiscoveriesBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('general.error_sad_smiley')}</p>
      </ContentCard>
    </OrganizationDiscoveriesBase>
  )

  const initialData = data.organizationDiscovery;

  return (
    <OrganizationDiscoveriesBase showBack={true}>
      <Card title={cardTitle}>
        <Formik
            initialValues={{ 
              name: initialData.name, 
            }}
            validationSchema={DISCOVERY_SCHEMA}
            onSubmit={(values, { setSubmitting }) => {
                console.log('submit values:')
                console.log(values)

                updateDiscovery({ variables: {
                  input: {
                    id: match.params.id,
                    name: values.name,
                  }
                }, refetchQueries: [
                    {query: GET_DISCOVERIES_QUERY, variables: {"archived": false }}
                ]})
                .then(({ data }) => {
                    console.log('got data', data)
                    history.push(returnUrl)
                    toast.success((t('organization.discoveries.toast_edit_success')), {
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
    </OrganizationDiscoveriesBase>
  )
}


export default withTranslation()(withRouter(OrganizationDiscoveryEdit))