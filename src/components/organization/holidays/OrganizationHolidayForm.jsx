import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from "react-router-dom"

import {
    Button,
    Card,
    Form
  } from "tabler-react"
  import { Form as FoForm, Field, ErrorMessage } from 'formik'

const OrganizationHolidayForm = ({ t, history, isSubmitting, errors, returnUrl }) => (
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
                      placeholderText={t('schedule.classes.placeholder_enddate')}
                    />
                    <ErrorMessage name="dateEnd" component="span" className="invalid-feedback" />
                  </Form.Group>
                </Grid.Col>
              </Grid.Row>
          <Form.Group label={t('general.note')}>
            <Editor
                tinymceScriptSrc="/d/static/tinymce/tinymce.min.js"
                textareaName="note"
                initialValue={values.note}
                init={tinymceBasicConf}
                onBlur={(e) => {
                    setFieldValue("note", e.target.getContent())
                    setFieldTouched("note", true, true)
                }}
                />
            <ErrorMessage name="note" component="span" className="invalid-feedback" />
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