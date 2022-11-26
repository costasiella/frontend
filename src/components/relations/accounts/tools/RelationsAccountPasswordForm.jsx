import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'
import {
  Card,
  Form,
  Grid
} from "tabler-react"


import ButtonFormSubmit from '../../../ui/ButtonFormSubmit'

const RelationsAccountPasswordForm = ({ t, history, isSubmitting, errors, values, inputData, setFieldTouched, setFieldValue }) => (
  <FoForm>
      <Card.Body>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label={t('general.password')}>
              <Field type="text" 
                      name="password" 
                      className={(errors.password) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off" />
              <ErrorMessage name="password" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
        </Grid.Row>
      </Card.Body>
      <Card.Footer>
          <ButtonFormSubmit disabled={isSubmitting} />
      </Card.Footer>
  </FoForm>
)

export default withTranslation()(withRouter(RelationsAccountPasswordForm))

