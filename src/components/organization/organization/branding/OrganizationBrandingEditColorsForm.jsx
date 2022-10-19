import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"

import {
    Card,
    Form,
  } from "tabler-react"
  import { Form as FoForm } from 'formik'

import ButtonFormCancel from '../../../ui/ButtonFormCancel'
import ButtonFormSubmit from '../../../ui/ButtonFormSubmit'


function OrganizationBrandingEditColorsForm({ 
  t, 
  history, 
  formTitle,
  isSubmitting, 
}) {


  return (
    <FoForm>
      <Card title={formTitle}>
        <Card.Body>
            <Form.Group label={t('organization.branding.color_background')}>
              <Field type="text" 
                     name="colorBackground" 
                     className={(errors.colorBackground) ? "form-control is-invalid" : "form-control"} 
                     autoComplete="off" />
              <ErrorMessage name="colorBackground" component="span" className="invalid-feedback" />
            </Form.Group>
            <Form.Group label={t('organization.branding.color_text')}>
              <Field type="text" 
                     name="colorText" 
                     className={(errors.colorText) ? "form-control is-invalid" : "form-control"} 
                     autoComplete="off" />
              <ErrorMessage name="colorText" component="span" className="invalid-feedback" />
            </Form.Group>
            <Form.Group label={t('organization.branding.color_accent')}>
              <Field type="text" 
                     name="colorAccent" 
                     className={(errors.colorAccent) ? "form-control is-invalid" : "form-control"} 
                     autoComplete="off" />
              <ErrorMessage name="colorAccent" component="span" className="invalid-feedback" />
            </Form.Group>
            <Form.Group label={t('organization.branding.color_secondary')}>
              <Field type="text" 
                     name="colorSecondary" 
                     className={(errors.colorSecondary) ? "form-control is-invalid" : "form-control"} 
                     autoComplete="off" />
              <ErrorMessage name="colorSecondary" component="span" className="invalid-feedback" />
            </Form.Group>
        </Card.Body>
        <Card.Footer>
          <ButtonFormSubmit disabled={isSubmitting} />
          <ButtonFormCancel returnUrl={returnUrl} />
        </Card.Footer>
      </Card>
    </FoForm>
  )
}
  
  
  export default withTranslation()(withRouter(OrganizationBrandingEditColorsForm))