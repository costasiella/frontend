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

import CSDatePicker from '../../../../../ui/CSDatePicker';


function AccountSubscriptionEditCreditForm ({ 
  t, 
  history, 
  match, 
  isSubmitting, 
  errors, 
  values, 
  inputData, 
  returnUrl, 
  setFieldTouched, 
  setFieldValue, 
  formTitle="create" })   
{

  let title
  if ( formTitle === "create" ) {
    title = t('relations.account.subscriptions.credits.add')
  } else {
    title = t('relations.account.subscriptions.credits.edit')
  }


  return (
    <FoForm>
      <Card.Body>
        <h5>{title}</h5>
        <Grid.Row>
        {/* TODO: Add expiration date field here */}
          <Grid.Col>
            <Form.Group label={t('general.expiration')}>
              <CSDatePicker 
                className={(errors.expiration) ? "form-control is-invalid" : "form-control"} 
                selected={values.expiration}
                onChange={(date) => {
                  setFieldValue("expiration", date)
                  setFieldTouched("expiration", true)
                }}
                onBlur={() => setFieldTouched("expiration", true)}
              />
              <ErrorMessage name="expiration" component="span" className="invalid-feedback" />
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

export default withTranslation()(withRouter(AccountSubscriptionEditCreditForm))