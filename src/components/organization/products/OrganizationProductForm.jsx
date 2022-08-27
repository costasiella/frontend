import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import { Form as FoForm, Field, ErrorMessage } from 'formik'

import {
  Button,
  Card,
  Grid,
  Form,
} from "tabler-react"


import { customFileInputLabelStyle } from "../../../../tools/custom_file_input_label_style"

function OrganizationProductForm ({ 
  t, 
  history, 
  match, 
  isSubmitting, 
  errors, 
  values, 
  returnUrl,
  inputFileName, 
  fileInputLabel, 
  handleFileInputChange=f=>f
})   
{
  return (
    <FoForm>
      <Card.Body>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label={t('general.name')}>
              <Field type="text" 
                      name="name" 
                      className={(errors.name) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off" />
              <ErrorMessage name="name" component="span" className="invalid-feedback" />
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
              {console.log("query data in classpass add:")}
              {console.log(initialData)}
              <option value="" key={v4()}></option>
              {initialData.financeTaxRates.edges.map(({ node }) =>
                  <option value={node.id} key={v4()}>{node.name} ({node.percentage}% {node.rateType})</option>
              )}
              </Field>
              <ErrorMessage name="financeTaxRate" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col>
            <Form.Group label={t('general.glaccount')}>
              <Field component="select" 
                      name="financeGlaccount" 
                      className={(errors.financeGlaccount) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off">
              <option value="" key={v4()}></option>
              {initialData.financeGlaccounts.edges.map(({ node }) =>
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
              {initialData.financeCostcenters.edges.map(({ node }) =>
                  <option value={node.id} key={v4()}>{node.name} ({node.code})</option>
              )}
              </Field>
              <ErrorMessage name="financeCostcenter" component="span" className="invalid-feedback" />
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
          <Link to={returnUrl}>
            <Button color="link" role="button">
                {t('general.cancel')}
            </Button>
          </Link>
      </Card.Footer>
    </FoForm>
  )
}

export default withTranslation()(withRouter(OrganizationProductForm))