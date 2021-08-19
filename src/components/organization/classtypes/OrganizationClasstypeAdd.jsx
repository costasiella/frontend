// @flow

import React from 'react'
import { useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik, Form as FoForm, Field, ErrorMessage } from 'formik'
import { toast } from 'react-toastify'

import { Editor } from '@tinymce/tinymce-react'
import { tinymceBasicConf } from "../../../plugin_config/tinymce"

import { GET_CLASSTYPES_QUERY, ADD_CLASSTYPE } from './queries'
import { CLASSTYPE_SCHEMA } from './yupSchema'


import {
  Button,
  Card,
  Form,
} from "tabler-react"

import { get_list_query_variables } from './tools'
import OrganizationClasstypesBase from './OrganizationClasstypesBase';


function OrganizationClasstypeAdd({t, history}) {
  const returnUrl = "/organization/classtypes"
  const [addClasstype] = useMutation(ADD_CLASSTYPE)

  return (
    <OrganizationClasstypesBase showBack={true}>
      <Card>
        <Card.Header>
          <Card.Title>{t('organization.classtypes.title_add')}</Card.Title>
        </Card.Header>
        <Formik
          initialValues={{ name: "", description: "", displayPublic: true, urlWebsite: '' }}
          validationSchema={CLASSTYPE_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              addClasstype({ variables: {
                input: {
                  name: values.name, 
                  description: values.description,
                  displayPublic: values.displayPublic,
                  urlWebsite: values.urlWebsite,
                  image: values.image
                },
                // file: values.image
              }, refetchQueries: [
                  {query: GET_CLASSTYPES_QUERY, variables: get_list_query_variables()}
              ]})
              .then(({ data }) => {
                  console.log('got data', data);
                  history.push(returnUrl)
                  toast.success((t('organization.classtypes.toast_add_success')), {
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
            {({ isSubmitting, setFieldValue, setFieldTouched, errors, values }) => (
                <FoForm>
                  {/* {console.log('values in FoForm')}
                  {console.log(values)} */}
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
                        <Form.Group label={t('general.name')}>
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
                          color="primary"
                          className="pull-right" 
                          type="submit" 
                          disabled={isSubmitting}
                        >
                          {t('general.submit')}
                        </Button>
                        <Button color="link" onClick={() => history.push(returnUrl)}>
                            {t('general.cancel')}
                        </Button>
                    </Card.Footer>
                </FoForm>
            )}
        </Formik>
      </Card>
    </OrganizationClasstypesBase>
  )
}

export default withTranslation()(withRouter(OrganizationClasstypeAdd))