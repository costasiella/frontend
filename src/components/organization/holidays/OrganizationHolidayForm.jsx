import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"

import {
    Button,
    Card,
    Form,
    Grid,
  } from "tabler-react"
import { Form as FoForm, Field, ErrorMessage } from 'formik'

import { Editor } from '@tinymce/tinymce-react'
import { tinymceBasicConf } from "../../../plugin_config/tinymce"  
import CSDatePicker from "../../ui/CSDatePicker"

const OrganizationHolidayForm = ({ t, history, isSubmitting, values, errors, setFieldTouched, setFieldValue, returnUrl }) => (
    <FoForm>
        <Card.Body>
          <Form.Group label={t('general.name')}>
            <Field type="text" 
                    name="name" 
                    className={(errors.name) ? "form-control is-invalid" : "form-control"} 
                    autoComplete="off" />
            <ErrorMessage name="name" component="span" className="invalid-feedback" />
          </Form.Group>
          <Grid.Row>
              <Grid.Col>
                <Form.Group label={t('general.date_start')}>
                  <CSDatePicker 
                      className={(errors.dateStart) ? "form-control is-invalid" : "form-control"} 
                      selected={values.dateStart}
                      onChange={(date) => {
                      setFieldValue("dateStart", date)
                      setFieldTouched("dateStart", true)
                      }}
                      onBlur={() => setFieldTouched("dateStart", true)}
                  />
                  <ErrorMessage name="dateStart" component="span" className="invalid-feedback" />
                </Form.Group>
              </Grid.Col>
                <Grid.Col>
                  <Form.Group label={t('general.date_end')}>
                    <CSDatePicker 
                      selected={values.dateEnd}
                      onChange={(date) => {
                          setFieldValue("dateEnd", date)
                          setFieldTouched("dateEnd", true)
                      }}
                      onBlur={() => setFieldTouched("dateEnd", true)}
                      placeholderText={t('general.date_end')}
                    />
                    <ErrorMessage name="dateEnd" component="span" className="invalid-feedback" />
                  </Form.Group>
                </Grid.Col>
              </Grid.Row>
            <h5>{t("general.apply_to")}</h5>
            <Form.Group>
              <Form.Label className="custom-switch">
                  <Field 
                  className="custom-switch-input"
                  type="checkbox" 
                  name="classes" 
                  checked={values.classes} />
                  <span className="custom-switch-indicator" ></span>
                  <span className="custom-switch-description">{t('general.classes')}</span>
              </Form.Label>
              <ErrorMessage name="classes" component="div" />   
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
  
  
  export default withTranslation()(withRouter(OrganizationHolidayForm))