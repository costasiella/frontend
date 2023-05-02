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


const RelationsAccountMollieCustomerForm = ({ t, history, isSubmitting, errors, values, inputData, setFieldTouched, setFieldValue }) => (
  <FoForm>
      <Card.Body>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label={t('relations.accounts.mollie_customer_id')}>
              <Field type="mollieCustomerId" 
                      name="mollieCustomerId" 
                      className={(errors.mollieCustomerId) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off" />
              <ErrorMessage name="mollieCustomerId" component="span" className="invalid-feedback" />
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

export default withTranslation()(withRouter(RelationsAccountMollieCustomerForm))
