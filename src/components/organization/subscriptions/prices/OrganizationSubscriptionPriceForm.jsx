// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'
import { v4 } from "uuid"


import {
  Card,
  Form,
  Grid
} from "tabler-react"

import CSDatePicker from "../../../ui/CSDatePicker"
import ButtonFormCancel from "../../../ui/ButtonFormCancel" 
import ButtonFormSubmit from "../../../ui/ButtonFormSubmit"


const OrganizationSubscriptionPriceForm = (
  { t, history, inputData, isSubmitting, errors, values, setFieldTouched, setFieldValue, returnUrl }
  ) => (
  <FoForm>
    <Card.Body>
      <Grid.Row>
        <Grid.Col>
          <Form.Group label={t('general.price')}>
            <Field type="text" 
                  name="price" 
                  className={(errors.price) ? "form-control is-invalid" : "form-control"} 
                  autoComplete="off" />
            <ErrorMessage name="price" component="span" className="invalid-feedback" />
          </Form.Group>
        </Grid.Col>
        <Grid.Col>
          <Form.Group label={t('general.taxrate')}>
            <Field component="select" 
                    name="financeTaxRate" 
                    className={(errors.financeTaxRate) ? "form-control is-invalid" : "form-control"} 
                    autoComplete="off">
              {console.log("query data in subscription price add:")}
              {console.log(inputData)}
              <option value="" key={v4()}>{t('general.please_select')}</option>
              {inputData.financeTaxRates.edges.map(({ node }) =>
                <option value={node.id} key={v4()}>{node.name} ({node.percentage}% {node.rateType})</option>
              )}
            </Field>
            <ErrorMessage name="financeTaxRate" component="span" className="invalid-feedback" />
          </Form.Group>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row>
        <Grid.Col>
          <Form.Group label={t('general.date_start')}>
            <CSDatePicker 
              selected={values.dateStart}
              onChange={(date) => setFieldValue("dateStart", date)}
              onBlur={() => setFieldTouched("dateStart", true)}
            />
            <ErrorMessage name="dateStart" component="span" className="invalid-feedback" />
          </Form.Group>
        </Grid.Col>
        <Grid.Col>
          <Form.Group label={t('general.date_end')}>
            <CSDatePicker 
              selected={values.dateEnd}
              onChange={(date) => setFieldValue("dateEnd", date)}
              onBlur={() => setFieldTouched("dateEnd", true)}
            />
            <ErrorMessage name="dateEnd" component="span" className="invalid-feedback" />
          </Form.Group>
        </Grid.Col>
      </Grid.Row>
    </Card.Body>
    <Card.Footer>
      <ButtonFormSubmit />
      <ButtonFormCancel returnUrl={returnUrl} />
    </Card.Footer>
  </FoForm>
);

export default withTranslation()(withRouter(OrganizationSubscriptionPriceForm))