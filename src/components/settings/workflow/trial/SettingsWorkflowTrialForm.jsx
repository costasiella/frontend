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


const SettingsWorkflowTrialForm = ({ t, history, isSubmitting, errors, values, returnUrl }) => (
  <FoForm>
      <Card.Body>
          <Form.Group label={t('settings.workflow.trial.trial_pass_limit')}>
            <Field type="text" 
              name="workflow_trial_pass_limit" 
              className={(errors.workflow_trial_pass_limit) ? "form-control is-invalid" : "form-control"} 
              autoComplete="off" />
            <ErrorMessage name="workflow_trial_pass_limit" component="span" className="invalid-feedback" />
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

export default withTranslation()(withRouter(SettingsWorkflowTrialForm))