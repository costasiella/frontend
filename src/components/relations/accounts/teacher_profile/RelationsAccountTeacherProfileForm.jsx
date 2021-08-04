// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { v4 } from 'uuid'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'


import {
  Button,
  Card,
  Form,
  Grid
} from "tabler-react"


import { Editor } from '@tinymce/tinymce-react'
import { tinymceBasicConf } from "../../../../plugin_config/tinymce"


const RelationsAccountTeacherProfileForm = ({ t, history, isSubmitting, errors, values, return_url, setFieldTouched, setFieldValue }) => (
  <FoForm>
      <Card.Body>
        <Grid.Row>
          <Grid.Col>
            <Form.Group>
              <Form.Label className="custom-switch">
                  <Field 
                  className="custom-switch-input"
                  type="checkbox" 
                  name="classes" 
                  checked={values.classes} />
                  <span className="custom-switch-indicator" ></span>
                  <span className="custom-switch-description">{t('relations.account.teacher_profile.classes')}</span>
              </Form.Label>
              <ErrorMessage name="classes" component="div" />   
            </Form.Group>  
          </Grid.Col>
          <Grid.Col>
            <Form.Group>
              <Form.Label className="custom-switch">
                  <Field 
                  className="custom-switch-input"
                  type="checkbox" 
                  name="events" 
                  checked={values.events} />
                  <span className="custom-switch-indicator" ></span>
                  <span className="custom-switch-description">{t('relations.account.teacher_profile.events')}</span>
              </Form.Label>
              <ErrorMessage name="events" component="div" />   
            </Form.Group>  
          </Grid.Col>
          <Grid.Col>
            <Form.Group>
              <Form.Label className="custom-switch">
                  <Field 
                  className="custom-switch-input"
                  type="checkbox" 
                  name="appointments" 
                  checked={values.appointments} />
                  <span className="custom-switch-indicator" ></span>
                  <span className="custom-switch-description">{t('relations.account.teacher_profile.appointments')}</span>
              </Form.Label>
              <ErrorMessage name="appointments" component="div" />   
            </Form.Group>  
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label={t('general.role')}>
              <Field type="text" 
                      name="role" 
                      className={(errors.role) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off" />
              <ErrorMessage name="role" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
        </Grid.Row>
        <Form.Group label={t('general.education')}>
          <Editor
              tinymceScriptSrc="/d/static/tinymce/tinymce.min.js"
              textareaName="education"
              initialValue={values.education}
              init={tinymceBasicConf}
              onBlur={(e) => {
                setFieldTouched("education", true)
                setFieldValue("education", e.target.getContent())
              }}
            />
          <ErrorMessage name="education" component="span" className="invalid-feedback" />
        </Form.Group>
        <Form.Group label={t('general.bio')}>
          <Editor
              tinymceScriptSrc="/d/static/tinymce/tinymce.min.js"
              textareaName="bio"
              initialValue={values.bio}
              init={tinymceBasicConf}
              onBlur={(e) => {
                setFieldTouched("bio", true)
                setFieldValue("bio", e.target.getContent())
              }}
            />
          <ErrorMessage name="bio" component="span" className="invalid-feedback" />
        </Form.Group>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label={t('relations.account.teacher_profile.url_bio')}>
              <Field type="text" 
                      name="urlBio" 
                      className={(errors.urlBio) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off" />
              <ErrorMessage name="urlBio" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
          <Grid.Col>
            <Form.Group label={t('relations.account.teacher_profile.url_website')}>
              <Field type="text" 
                      name="urlWebsite" 
                      className={(errors.urlWebsite) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off" />
              <ErrorMessage name="urlWebsite" component="span" className="invalid-feedback" />
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
          
          {/* <Button color="link" onClick={() => history.push(return_url)}>
              {t('general.cancel')}
          </Button> */}
      </Card.Footer>
  </FoForm>
)

export default withTranslation()(withRouter(RelationsAccountTeacherProfileForm))

