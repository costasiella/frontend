import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
    Card,
    Form,
    Grid,
    Icon,
  } from "tabler-react"
import { Form as FoForm, Field, ErrorMessage } from 'formik'

import ButtonFormSubmit from '../../../ui/ButtonFormSubmit'


function OrganizationBrandingEditColorsForm({ t, history, errors, formTitle, isSubmitting }) {
  return (
    <FoForm>
      <Card title={formTitle}>
        <Card.Body>
          <Card.Alert color="info">
            <Icon name="info" /> {t("organization.branding.colors_explanation")}
          </Card.Alert>
        </Card.Body>
        <Card.Body>
          <Grid.Row>
            <Grid.Col md={3}>
              <Form.Group label={t('organization.branding.color_background')}>
                <Field type="color" 
                      name="colorBackground" 
                      className={(errors.colorBackground) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off" />
                <ErrorMessage name="colorBackground" component="span" className="invalid-feedback" />
              </Form.Group>
            </Grid.Col>
            <Grid.Col md={3}>
              <Form.Group label={t('organization.branding.color_text')}>
                <Field type="color" 
                      name="colorText" 
                      className={(errors.colorText) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off" />
                <ErrorMessage name="colorText" component="span" className="invalid-feedback" />
              </Form.Group>
            </Grid.Col>
            <Grid.Col md={3}>
              <Form.Group label={t('organization.branding.color_accent')}>
                <Field type="color" 
                      name="colorAccent" 
                      className={(errors.colorAccent) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off" />
                <ErrorMessage name="colorAccent" component="span" className="invalid-feedback" />
              </Form.Group>
            </Grid.Col>
            <Grid.Col md={3}>   
              <Form.Group label={t('organization.branding.color_secondary')}>
                <Field type="color" 
                      name="colorSecondary" 
                      className={(errors.colorSecondary) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off" />
                <ErrorMessage name="colorSecondary" component="span" className="invalid-feedback" />
              </Form.Group>
            </Grid.Col>
          </Grid.Row>
        </Card.Body>
        <Card.Footer>
          <ButtonFormSubmit disabled={isSubmitting} />
        </Card.Footer>
      </Card>
    </FoForm>
  )
}
  
  
  export default withTranslation()(withRouter(OrganizationBrandingEditColorsForm))