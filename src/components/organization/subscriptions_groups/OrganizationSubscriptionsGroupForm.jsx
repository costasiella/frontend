// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'
import { Link } from 'react-router-dom'

import {
  Alert,
  Button,
  Card,
  Form,
} from "tabler-react"

const OrganizationSubscriptionGroupForm = ({ t, history, isSubmitting, errors, returnUrl }) => (
  <FoForm>
      <Card.Body>
          <Form.Group label={t('general.name')}>
            <Field type="text" 
                    name="name" 
                    className={(errors.name) ? "form-control is-invalid" : "form-control"} 
                    autoComplete="off" />
            <ErrorMessage name="name" component="span" className="invalid-feedback" />
          </Form.Group>
          <Form.Group label={t('general.description')}>
            <Field type="text" 
                    name="description" 
                    className={(errors.description) ? "form-control is-invalid" : "form-control"} 
                    autoComplete="off" />
            <ErrorMessage name="description" component="span" className="invalid-feedback" />
          </Form.Group>
      </Card.Body>
      <Card.Footer>
        {(isSubmitting) ?
        <Button 
          color="primary"
          className="pull-right" 
          type="submit" 
          loading
          disabled={isSubmitting}
        >
          {t("general.submit")}
        </Button>
        :
          <Button 
            color="primary"
            className="pull-right" 
            type="submit" 
            disabled={isSubmitting}
          >
            {t('general.submit')}
          </Button>
        }
        <Link to={returnUrl}>
          <Button color="link">
              {t('general.cancel')}
          </Button>
        </Link>
        {(isSubmitting) ? 
          <Alert type="primary" hasExtraSpace>
            <strong>{t('general.please_wait')}</strong> {t('organization.subscription_groups.toast_creating_might_take_a_while')}
          </Alert> : 
          ""
        }
      </Card.Footer>
  </FoForm>
)

export default withTranslation()(withRouter(OrganizationSubscriptionGroupForm))