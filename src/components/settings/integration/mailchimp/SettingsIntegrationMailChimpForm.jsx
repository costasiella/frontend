import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'


import {
  Button,
  Card,
  Form,
} from "tabler-react"


const SettingsIntegrationMollieForm = ({ t, history, isSubmitting, errors, values, returnUrl }) => (
  <FoForm>
      <Card.Body>
          <Form.Group label={t('settings.integration.mailchimp.user')}>
            <Field type="text" 
              name="mailchimp_user" 
              className={(errors.mailchimp_user) ? "form-control is-invalid" : "form-control"} 
              autoComplete="off" />
            <ErrorMessage name="mailchimp_user" component="span" className="invalid-feedback" />
          </Form.Group>
          <Form.Group label={t('settings.integration.mailchimp.api_key')}>
            <Field type="text" 
              name="mailchimp_api_key" 
              className={(errors.mailchimp_api_key) ? "form-control is-invalid" : "form-control"} 
              autoComplete="off" />
            <ErrorMessage name="mailchimp_api_key" component="span" className="invalid-feedback" />
          </Form.Group>
      </Card.Body>
      <Card.Footer>
          <Button 
            color="primary"
            type="submit" 
            disabled={isSubmitting}
          >
            {t('general.submit')}
          </Button>
          {/* <Link to={returnUrl}>
            <Button 
              type="button" 
              color="link">
                {t('general.cancel')}
            </Button>
          </Link> */}
      </Card.Footer>
  </FoForm>
)

export default withTranslation()(withRouter(SettingsIntegrationMailChimpForm))