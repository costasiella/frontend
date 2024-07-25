import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'
import { v4 } from 'uuid'

import {
  Button,
  Dimmer,
  Form,
  Grid,
} from "tabler-react"

import FinanceInvoiceItemDelete from './FinanceInvoiceItemDelete'


const FinanceInvoiceItemEditForm = ({ t, isSubmitting, errors, node, touched, handleChange, setFieldTouched, inputData }) => (
  <Dimmer loader={isSubmitting} active={isSubmitting}>
    <FoForm>
      <Grid.Row>
      {/* <Icon name="more-vertical" /> */}
        <Grid.Col md={3} className="cs-grid-table-cell">
          <Form.Group>
            <Field type="text" 
                    name="productName" 
                    className={(errors.productName) ? "form-control is-invalid" : "form-control"} 
                    autoComplete="off" 
                    onChange={(e) => {
                      handleChange(e)
                      setFieldTouched("productName", true, true)
                    }}
            />
            <ErrorMessage name="productName" component="span" className="invalid-feedback" />
          </Form.Group>
        </Grid.Col>
        <Grid.Col md={3} className="cs-grid-table-cell finance-invoice-item-description">
          <Form.Group>
            <Field type="text" 
                    name="description" 
                    className={(errors.description) ? "form-control is-invalid" : "form-control"} 
                    autoComplete="off" 
                    component="textarea"
                    onChange={(e) => {
                      handleChange(e)
                      setFieldTouched("description", true, true)
                    }}
            />
            <ErrorMessage name="description" component="span" className="invalid-feedback" />
          </Form.Group>
        </Grid.Col>
        <Grid.Col md={2} className="cs-grid-table-cell">
          <Form.Group>
            <Field type="text" 
                   name="quantity" 
                   className={(errors.quantity) ? "form-control is-invalid" : "form-control"} 
                   autoComplete="off" 
                   onChange={(e) => {
                    handleChange(e)
                    setFieldTouched("quantity", true, true)
                  }}
            />
            <ErrorMessage name="quantity" component="span" className="invalid-feedback" />
          </Form.Group>
          <Form.Group>
            <Field type="text" 
                    name="price" 
                    className={(errors.price) ? "form-control is-invalid" : "form-control"} 
                    autoComplete="off" 
                    onChange={(e) => {
                      handleChange(e)
                      setFieldTouched("price", true, true)
                    }}
            />
            <ErrorMessage name="price" component="span" className="invalid-feedback" />
          </Form.Group>
        </Grid.Col>
        <Grid.Col md={2} className="cs-grid-table-cell">
          <Form.Group>
            <Field component="select" 
                  name="financeTaxRate" 
                  className={(errors.financeTaxRate) ? "form-control is-invalid" : "form-control"} 
                  autoComplete="off"
                  onChange={(e) => {
                    handleChange(e)
                    setFieldTouched("financeTaxRate", true, true)
                  }}
            >
              {console.log("query data in form finance tax rate:")}
              {console.log(inputData)}
              <option value="" key={v4()}></option>
              {inputData.financeTaxRates.edges.map(({ node }) =>
                <option value={node.id} key={v4()}>{node.name} ({node.percentage}% {node.rateType})</option>
              )}
            </Field>
            <ErrorMessage name="financeTaxRate" component="span" className="invalid-feedback" />
          </Form.Group>
        </Grid.Col>
        <Grid.Col md={1} className="cs-grid-table-cell">
          <span className="float-right">{node.totalDisplay}</span> <br /><br />
        </Grid.Col>
        <Grid.Col md={1} className="cs-grid-table-cell">
          <span className="float-right"><FinanceInvoiceItemDelete node={node}/></span><br /><br /> <br />
          {(Object.keys(touched).length === 0) ? "" :
            <Button 
              color="primary"
              className="pull-right" 
              type="submit" 
              disabled={isSubmitting}
            >
              {t('general.submit')}
            </Button>
          }
        </Grid.Col>
      </Grid.Row>
      {/* {(Object.keys(touched).length === 0) ? "" :
        <Grid.Row>
          <Grid.Col md={12} className="cs-grid-table-cell">
            <Alert type="primary">
              <p>A change was detected to the item above. Click the save button to save it. </p>
              <Button 
                color="primary"
                // className="pull-right" 
                type="submit" 
                disabled={isSubmitting}
              >
                {t('general.submit')}
              </Button>
            </Alert>
          </Grid.Col>
        </Grid.Row>
      } */}
    </FoForm>
  </Dimmer>
)

export default withTranslation()(withRouter(FinanceInvoiceItemEditForm))