import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
    Button,
    Card,
    Form,
    Grid
  } from "tabler-react"
  import { Form as FoForm, Field, ErrorMessage } from 'formik'

import { Editor } from '@tinymce/tinymce-react'
import { tinymceBasicConf } from "../../../plugin_config/tinymce"


const OrganizationForm = ({ 
  t, 
  history, 
  isSubmitting, 
  errors, 
  values, 
  setFieldTouched, 
  setFieldValue,
}) => (
    <FoForm>
      <Card.Body>
        <Form.Group label={t('general.name')}>
          <Field type="text" 
                  name="name" 
                  className={(errors.name) ? "form-control is-invalid" : "form-control"} 
                  autoComplete="off" />
          <ErrorMessage name="name" component="span" className="invalid-feedback" />
        </Form.Group>
        <Form.Group label={t('general.address')}>
          <Editor
            tinymceScriptSrc="/d/static/tinymce/tinymce.min.js"
            textareaName="address"
            initialValue={values.address}
            init={tinymceBasicConf}
            onBlur={(e) => {
              setFieldValue("address", e.target.getContent())
              setFieldTouched("address", true, true)
            }}
          />
          <ErrorMessage name="address" component="span" className="invalid-feedback" />
        </Form.Group>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label={t('general.phone')}>
              <Field type="text" 
                      name="phone" 
                      className={(errors.phone) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off" />
              <ErrorMessage name="phone" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
          <Grid.Col>
            <Form.Group label={t('general.email')}>
              <Field type="text" 
                      name="email" 
                      className={(errors.email) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off" />
              <ErrorMessage name="email" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label={t('organization.organization.registration')}>
              <Field type="text" 
                      name="registration" 
                      className={(errors.registration) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off" />
              <ErrorMessage name="registration" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
          <Grid.Col>
            <Form.Group label={t('organization.organization.tax_registration')}>
              <Field type="text" 
                      name="taxRegistration" 
                      className={(errors.taxRegistration) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off" />
              <ErrorMessage name="taxRegistration" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
        </Grid.Row>
      </Card.Body>
      <Card.Footer>
          <Button 
          color="primary"
          // className="pull-right" 
          type="submit" 
          disabled={isSubmitting}
          >
          {t('general.submit')}
          </Button>
      </Card.Footer>
    </FoForm>
)
  
  
  export default withTranslation()(withRouter(OrganizationForm))