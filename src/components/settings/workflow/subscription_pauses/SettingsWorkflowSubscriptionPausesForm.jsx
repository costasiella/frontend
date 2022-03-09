// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'


import {
  Button,
  Card,
  Form,
} from "tabler-react"


const SettingsWorkflowSubscriptionPausesForm = ({ t, history, isSubmitting, errors, values, returnUrl }) => (
  <FoForm>
      <Card.Body>
          <Form.Group label={t('settings.workflow.subscription_pauses.min_duration_in_days')}>
            <Field type="text" 
              name="workflow_subscription_pauses_min_duration_in_days" 
              className={(errors.workflow_subscription_pauses_min_duration_in_days) ? "form-control is-invalid" : "form-control"} 
              autoComplete="off" />
            <ErrorMessage name="workflow_subscription_pauses_min_duration_in_days" component="span" className="invalid-feedback" />
          </Form.Group>
          <Form.Group label={t('settings.workflow.subscription_pauses.max_pauses_in_year')}>
            <Field type="text" 
              name="workflow_subscription_pauses_max_pauses_in_year" 
              className={(errors.workflow_subscription_pauses_max_pauses_in_year) ? "form-control is-invalid" : "form-control"} 
              autoComplete="off" />
            <ErrorMessage name="workflow_subscription_pauses_max_pauses_in_year" component="span" className="invalid-feedback" />
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

export default withTranslation()(withRouter(SettingsWorkflowSubscriptionPausesForm))