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


const SettingsWorkflowClassBookingForm = ({ t, history, isSubmitting, errors, values, returnUrl }) => (
  <FoForm>
      <Card.Body>
          <Form.Group label={t('settings.workflow.class_booking.book_days_advance')}>
            <Field type="text" 
              name="workflow_class_book_days_advance" 
              className={(errors.workflow_class_book_days_advance) ? "form-control is-invalid" : "form-control"} 
              autoComplete="off" />
            <ErrorMessage name="workflow_class_book_days_advance" component="span" className="invalid-feedback" />
          </Form.Group>
          <Form.Group label={t('settings.workflow.class_booking.cancel_until')}>
            <Field type="text" 
              name="workflow_class_cancel_until" 
              className={(errors.workflow_class_cancel_until) ? "form-control is-invalid" : "form-control"} 
              autoComplete="off" />
            <ErrorMessage name="workflow_class_cancel_until" component="span" className="invalid-feedback" />
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

export default withTranslation()(withRouter(SettingsWorkflowClassBookingForm))