// @flow

import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik, Form as FoForm, Field, ErrorMessage } from 'formik'
import { toast } from 'react-toastify'
import { Link } from "react-router-dom"

import { Editor } from '@tinymce/tinymce-react'
import { tinymceBasicConf } from "../../../plugin_config/tinymce"

import { GET_CLASSTYPES_QUERY, GET_CLASSTYPE_QUERY, UPDATE_CLASSTYPE } from './queries'
import { CLASSTYPE_SCHEMA } from './yupSchema'

import {
  Button,
  Card,
  Dimmer,
  Form,
} from "tabler-react";

import ContentCard from "../../general/ContentCard"
import OrganizationClasstypesBase from './OrganizationClasstypesBase';


function OrganizationClasstypeEdit({ t, history, match }) {
  const id = match.params.id
  const cardTitle = t('organization.classtypes.title_edit')
  const returnUrl = "/organization/classtypes"
  const { loading, error, data } = useQuery(GET_CLASSTYPE_QUERY, { variables: {
    id: id
  }})
  const [ updateClasstype ] = useMutation(UPDATE_CLASSTYPE)

  if (loading) return (
    <OrganizationClasstypesBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationClasstypesBase>
  )
  // Error
  if (error) return (
    <OrganizationClasstypesBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('general.error_sad_smiley')}</p>
      </ContentCard>
    </OrganizationClasstypesBase>
  )

                      
  const initialData = data.organizationClasstype
  console.log('query data')
  console.log(data)

  return (
    <OrganizationClasstypesBase showBack={true}>
      <Card>
        <Card.Header>
          <Card.Title>{cardTitle}</Card.Title>
        </Card.Header>
        <Formik
            initialValues={{ 
              name: initialData.name, 
              description: initialData.description,
              displayPublic: initialData.displayPublic,
              urlWebsite: initialData.urlWebsite
            }}
            validationSchema={CLASSTYPE_SCHEMA}
            onSubmit={(values, { setSubmitting }) => {
                console.log('submit values:')
                console.log(values)

                updateClasstype({ variables: {
                  input: {
                    id: id,
                    name: values.name,
                    description: (values.description) ? values.description: '',
                    displayPublic: values.displayPublic,
                    urlWebsite: (values.urlWebsite) ? values.urlWebsite: ''
                  }
                }, refetchQueries: [
                    {query: GET_CLASSTYPES_QUERY, variables: {"archived": false }}
                ]})
                .then(({ data }) => {
                    console.log('got data', data)
                    toast.success((t('organization.classtypes.toast_edit_success')), {
                        position: toast.POSITION.BOTTOM_RIGHT
                      })
                    setSubmitting(false)
                  }).catch((error) => {
                    toast.error((t('general.toast_server_error')) + ': ' +  error, {
                        position: toast.POSITION.BOTTOM_RIGHT
                      })
                    console.log('there was an error sending the query', error);
                    setSubmitting(false)
                  })
            }}
            >
            {({ isSubmitting, errors, values, setFieldValue, setFieldTouched }) => (
                <FoForm>
                    {console.log(values)}
                    <Card.Body>
                        <Form.Group>
                          <Form.Label className="custom-switch">
                            <Field 
                              className="custom-switch-input"
                              type="checkbox" 
                              name="displayPublic" 
                              checked={values.displayPublic} />
                            <span className="custom-switch-indicator" ></span>
                            <span className="custom-switch-description">{t('organization.classtype.public')}</span>
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
                        <Form.Group label={t('general.description')}>
                          <Editor
                            tinymceScriptSrc="/d/static/tinymce/tinymce.min.js"
                            textareaName="description"
                            initialValue={values.description}
                            init={tinymceBasicConf}
                            onBlur={(e) => {
                              setFieldValue("description", e.target.getContent())
                              setFieldTouched("description", true)
                            }}
                          />
                          <ErrorMessage name="description" component="span" className="invalid-feedback" />
                        </Form.Group>
                        <Form.Group label={t('organization.classtype.url_website')}>
                          <Field type="text" 
                                name="urlWebsite" 
                                className={(errors.urlWebsite) ? "form-control is-invalid" : "form-control"} 
                                autoComplete="off" />
                          <ErrorMessage name="urlWebsite" component="span" className="invalid-feedback" />
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
    </OrganizationClasstypesBase>
  )
}

export default withTranslation()(withRouter(OrganizationClasstypeEdit))