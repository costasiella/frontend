import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"
import {
    Button,
    Card,
    Form,
    Grid
  } from "tabler-react"
  import { Form as FoForm, Field, ErrorMessage } from 'formik'

import { Editor } from '@tinymce/tinymce-react'
import { tinymceBasicConf } from "../../../../plugin_config/tinymce"

const SettingsMailChimpListForm = ({ t, history, isSubmitting, errors, values, setFieldValue, setFieldTouched, returnUrl }) => (
    <FoForm>
        <Card.Body>
          <Grid.Row>
            <Grid.Col>
              <Form.Group label={t('general.name')}>
                <Field type="text" 
                        name="name" 
                        className={(errors.name) ? "form-control is-invalid" : "form-control"} 
                        autoComplete="off" />
                <ErrorMessage name="name" component="span" className="invalid-feedback" />
              </Form.Group>
            </Grid.Col>
            <Grid.Col>
              <Form.Group label={t('settings.mail.mailchimp_lists.mailchimp_list_id')}>
                <Field type="text" 
                        name="mailchimpListId" 
                        className={(errors.mailchimpListId) ? "form-control is-invalid" : "form-control"} 
                        autoComplete="off" />
                <ErrorMessage name="mailchimpListId" component="span" className="invalid-feedback" />
              </Form.Group>
            </Grid.Col>
          </Grid.Row>
            <Form.Group label={t('general.frequency')}>
              <Field type="text" 
                      name="frequency" 
                      className={(errors.frequency) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off" />
              <ErrorMessage name="frequency" component="span" className="invalid-feedback" />
            </Form.Group>
            <Form.Group label={t('general.description')}>
              <Editor
                tinymceScriptSrc="/d/static/tinymce/tinymce.min.js"
                textareaName="description"
                initialValue={values.description}
                init={tinymceBasicConf}
                onBlur={(e) => {
                  setFieldValue("description", e.target.getContent())
                  setFieldTouched("description", true, true)
                }}
              />
              <ErrorMessage name="description" component="span" className="invalid-feedback" />
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
)
  
  
  export default withTranslation()(withRouter(SettingsMailChimpListForm))