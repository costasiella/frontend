import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'
import { v4 } from 'uuid'

import {
  Card,
  Form,
  Grid,
} from "tabler-react";

import { customFileInputLabelStyle } from "../../../tools/custom_file_input_label_style"
import CSDatePicker from "../../ui/CSDatePicker"  
import ButtonFormSubmit from '../../ui/ButtonFormSubmit'
import ButtonFormCancel from '../../ui/ButtonFormCancel'

function FinanceExpenseForm({ 
  t, 
  history, 
  errors, 
  values, 
  inputData,
  isSubmitting, 
  setFieldTouched,
  setFieldValue,
  returnUrl, 
  inputFileName, 
  fileInputLabel, 
  handleFileInputChange=f=>f, 
}) {
  return (
    <FoForm>
      <Card.Body> 
        <Grid.Row>
          <Grid.Col>
            <Form.Group label={t('general.date')}>
              <CSDatePicker 
                className={(errors.date) ? "form-control is-invalid" : "form-control"} 
                selected={values.date}
                onChange={(date) => {
                  setFieldValue("date", date)
                  setFieldTouched("date", true)
                }}
                onBlur={() => setFieldTouched("date", true)}
              />
              <ErrorMessage name="date" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
          <Grid.Col>
            <Form.Group label={t('general.summary')}>
              <Field type="text" 
                    name="summary" 
                    className={(errors.summary) ? "form-control is-invalid" : "form-control"} 
                    autoComplete="off" />
              <ErrorMessage name="summary" component="span" className="invalid-feedback" />
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
        <Grid.Row>
          <Grid.Col>
            <Form.Group label={t('general.amount')}>
                <Field type="text" 
                    name="amount" 
                    className={(errors.amount) ? "form-control is-invalid" : "form-control"} 
                    autoComplete="off" />
                <ErrorMessage name="amount" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
          <Grid.Col>
            <Form.Group label={t('general.tax')}>
                <Field type="text" 
                    name="tax" 
                    className={(errors.tax) ? "form-control is-invalid" : "form-control"} 
                    autoComplete="off" />
                <ErrorMessage name="tax" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label={t('general.supplier')}>
              <Field component="select" 
                      name="supplier" 
                      className={(errors.supplier) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off">
                <option value="" key={v4()}></option>
                {inputData.businesses.edges.map(({ node }) =>
                  <option value={node.id} key={v4()}>{node.name}</option>
                )}
              </Field>
              <ErrorMessage name="supplier" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
          <Grid.Col>
            <Form.Group label={t('general.glaccount')}>
              <Field component="select" 
                      name="financeGlaccount" 
                      className={(errors.financeGlaccount) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off">
                <option value="" key={v4()}></option>
                {inputData.financeGlaccounts.edges.map(({ node }) =>
                  <option value={node.id} key={v4()}>{node.name} ({node.code})</option>
                )}
              </Field>
              <ErrorMessage name="financeGlaccount" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
          <Grid.Col>
            <Form.Group label={t('general.costcenter')}>
              <Field component="select" 
                      name="financeCostcenter" 
                      className={(errors.financeCostcenter) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off">
                <option value="" key={v4()}></option>
                {inputData.financeCostcenters.edges.map(({ node }) =>
                  <option value={node.id} key={v4()}>{node.name} ({node.code})</option>
                )}
              </Field>
              <ErrorMessage name="financeCostcenter" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label={t('general.custom_file_input_label')}>
              <div className="custom-file">
                <input type="file" ref={inputFileName} className="custom-file-input" onChange={handleFileInputChange} />
                <label className="custom-file-label" style={customFileInputLabelStyle}>
                  {fileInputLabel}
                </label>
              </div>
            </Form.Group>
          </Grid.Col>
        </Grid.Row>
      </Card.Body>
      <Card.Footer>
          <ButtonFormSubmit disabled={isSubmitting} />
          <ButtonFormCancel returnUrl={returnUrl} />
      </Card.Footer>
    </FoForm>
  )
}

export default withTranslation()(withRouter(FinanceExpenseForm))