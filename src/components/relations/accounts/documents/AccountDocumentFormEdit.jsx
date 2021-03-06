// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'
import { Link } from "react-router-dom"

import {
  Button,
  Card,
  Form,
  Grid,
} from "tabler-react";
  

function AccountDocumentFormEdit({ t, history, errors, values, isSubmitting, returnUrl }) {
  return (
    <FoForm>
      <Card.Body> 
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
            className="pull-right"
            color="primary"
            disabled={isSubmitting}
            type="submit"
          >
            {t('general.submit')}
          </Button>
          <Link to={returnUrl}>
            <Button
              type="button" 
              color="link"
            >
              {t('general.cancel')}
            </Button>
          </Link>
      </Card.Footer>
    </FoForm>
  )
}

export default withTranslation()(withRouter(AccountDocumentFormEdit))