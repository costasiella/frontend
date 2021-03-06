import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { v4 } from 'uuid'
import { Link } from 'react-router-dom'

import {
    Button,
    Card,
    Form,
    Grid
  } from "tabler-react"
  import { Form as FoForm, Field, ErrorMessage } from 'formik'

import { Editor } from '@tinymce/tinymce-react'
import { tinymceBasicConf } from "../../../plugin_config/tinymce"

const ScheduleEventForm = ({ t, history, inputData, isSubmitting, setFieldValue, setFieldTouched, values, errors, returnUrl }) => (
  <FoForm>
    <Card.Body>
      <Grid.Row>
        <Grid.Col>
          <Form.Group>
            <Form.Label className="custom-switch">
                <Field 
                  className="custom-switch-input"
                  type="checkbox" 
                  name="displayPublic" 
                  checked={values.displayPublic} />
                <span className="custom-switch-indicator" ></span>
                <span className="custom-switch-description">{t('schedule.events.public')}</span>
            </Form.Label>
            <ErrorMessage name="displayPublic" component="div" />   
          </Form.Group>  
        </Grid.Col>
        <Grid.Col>
          <Form.Group>
            <Form.Label className="custom-switch">
                <Field 
                className="custom-switch-input"
                type="checkbox" 
                name="displayShop" 
                checked={values.displayShop} />
                <span className="custom-switch-indicator" ></span>
                <span className="custom-switch-description">{t('schedule.events.shop')}</span>
            </Form.Label>
            <ErrorMessage name="displayShop" component="div" />   
          </Form.Group>  
        </Grid.Col>
        <Grid.Col>
          <Form.Group>
            <Form.Label className="custom-switch">
                <Field 
                className="custom-switch-input"
                type="checkbox" 
                name="autoSendInfoMail" 
                checked={values.autoSendInfoMail} />
                <span className="custom-switch-indicator" ></span>
                <span className="custom-switch-description">{t('schedule.events.auto_send_info_mail')}</span>
            </Form.Label>
            <ErrorMessage name="autoSendInfoMail" component="div" />   
          </Form.Group>  
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col>
          <Form.Group label={t('general.location')}>
            <Field component="select" 
                  name="organizationLocation" 
                  className={(errors.organizationLocation) ? "form-control is-invalid" : "form-control"} 
                  autoComplete="off">
              <option value="" key={v4()}>{t("schedule.event.location_please_select")}</option>
              {inputData.organizationLocations.edges.map(({ node }) =>
                <option value={node.id} key={v4()}>{node.name}</option>
              )}
            </Field>
            <ErrorMessage name="organizationLocation" component="span" className="invalid-feedback" />
          </Form.Group> 
        </Grid.Col>
        <Grid.Col>
          <Form.Group label={t('general.level')}>
            <Field component="select" 
                  name="organizationLevel" 
                  className={(errors.organizationLevel) ? "form-control is-invalid" : "form-control"} 
                  autoComplete="off">
              <option value="" key={v4()}></option>
              {inputData.organizationLevels.edges.map(({ node }) =>
                <option value={node.id} key={v4()}>{node.name}</option>
              )}
            </Field>
            <ErrorMessage name="organizationLevel" component="span" className="invalid-feedback" />
          </Form.Group> 
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col>
          <Form.Group label={t('general.instructor')}>
            <Field component="select" 
                  name="instructor" 
                  className={(errors.instructor) ? "form-control is-invalid" : "form-control"} 
                  autoComplete="off">
              <option value="" key={v4()}>{t("schedule.event.instructor_please_select")}</option>
              {inputData.accounts.edges.map(({ node }) =>
                <option value={node.id} key={v4()}>{node.fullName}</option>
              )}
            </Field>
            <ErrorMessage name="instructor" component="span" className="invalid-feedback" />
          </Form.Group> 
        </Grid.Col>
        <Grid.Col>
          <Form.Group label={t('general.instructor2')}>
            <Field component="select" 
                  name="instructor2" 
                  className={(errors.instructor2) ? "form-control is-invalid" : "form-control"} 
                  autoComplete="off">
              <option value="" key={v4()}></option>
              {inputData.accounts.edges.map(({ node }) =>
                <option value={node.id} key={v4()}>{node.fullName}</option>
              )}
            </Field>
            <ErrorMessage name="instructor2" component="span" className="invalid-feedback" />
          </Form.Group> 
        </Grid.Col>
      </Grid.Row>
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
      </Grid.Row>
      <Grid.Row>
        <Grid.Col>
          <Form.Group label={t('general.tagline')}>
            <Field type="text" 
                    name="tagline" 
                    className={(errors.tagline) ? "form-control is-invalid" : "form-control"} 
                    autoComplete="off" />
            <ErrorMessage name="tagline" component="span" className="invalid-feedback" />
          </Form.Group>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col>
          <Form.Group label={t('general.preview')}>
            <Editor
              tinymceScriptSrc="/d/static/tinymce/tinymce.min.js"
              textareaName="preview"
              initialValue={values.preview}
              init={tinymceBasicConf}
              onBlur={(e) => {
                setFieldValue("preview", e.target.getContent())
                setFieldTouched("preview", true, true)
              }}
              />
            <ErrorMessage name="preview" component="span" className="invalid-feedback" />
          </Form.Group>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col>
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
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col>
          <Form.Group label={t('general.infoMailContent')}>
            <Editor
              tinymceScriptSrc="/d/static/tinymce/tinymce.min.js"
              textareaName="infoMailContent"
              initialValue={values.infoMailContent}
              init={tinymceBasicConf}
              onBlur={(e) => {
                setFieldValue("infoMailContent", e.target.getContent())
                setFieldTouched("infoMailContent", true, true)
              }}
              />
            <ErrorMessage name="infoMailContent" component="span" className="invalid-feedback" />
          </Form.Group>
        </Grid.Col>
      </Grid.Row>
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
  
  
export default withTranslation()(withRouter(ScheduleEventForm))