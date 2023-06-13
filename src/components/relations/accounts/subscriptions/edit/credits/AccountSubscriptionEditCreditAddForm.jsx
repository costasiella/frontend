import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'

import {
  Button,
  Card,
  Grid,
  Form,
} from "tabler-react"


function AccountSubscriptionEditCreditAddForm ({ 
  t, 
  history, 
  match, 
  isSubmitting, 
  errors, 
  returnUrl 
})   
{

  return (
    <FoForm>
      <Card.Body>
        <h5>{t('relations.account.subscriptions.credits.add')}</h5>
        <Grid.Row>
          <Grid.Col>
          <Form.Group label={t('general.amount')}>
              <Field type="number" 
                      name="amount" 
                      className={(errors.amount) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off" />
              <ErrorMessage name="amount" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label={t('general.description')}>
              <Field type="text" 
                  name="description" 
                  className={(errors.description) ? "form-control is-invalid" : "form-control"} 
                  autoComplete="off" />
              <ErrorMessage name="description" component="span" className="invalid-feedback" />
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
        <Button color="link" onClick={() => history.push(returnUrl)} role="button">
            {t('general.cancel')}
        </Button>
      </Card.Footer>
    </FoForm>
  )
}

export default withTranslation()(withRouter(AccountSubscriptionEditCreditAddForm))