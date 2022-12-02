import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'
import {
  Button,
  Card,
  Form,
  Grid
} from "tabler-react"


const RelationsAccountPasswordForm = ({ t, history, isSubmitting, errors, values, inputData, setFieldTouched, setFieldValue }) => (
  <FoForm>
      <Card.Body>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label={t('relations.accounts.set_password')}>
              <Field type="password" 
                      name="passwordNew" 
                      className={(errors.passwordNew) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off" />
              <ErrorMessage name="passwordNew" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
        </Grid.Row>
      </Card.Body>
      <Card.Footer>
        <Button 
          color="primary"
          // className="pull-right" 
          type="submit" 
          disabled={isSubmitting}
        >
          {t('general.submit')}
        </Button>  
      </Card.Footer>
  </FoForm>
)

export default withTranslation()(withRouter(RelationsAccountPasswordForm))

