// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'
import { v4 } from 'uuid'

import {
  Button,
  Dimmer,
  Form,
} from "tabler-react"

import CSDatePicker from "../../../ui/CSDatePicker"


const FinanceInvoiceEditOptionsForm = ({ t, isSubmitting, values, errors, handleChange, touched, setFieldValue, setFieldTouched, inputData }) => (
  <Dimmer loader={isSubmitting} active={isSubmitting}>
    <FoForm>
      <Form.Group label={t('finance.invoices.invoice_number')}>
        <Field type="text" 
                name="invoiceNumber" 
                className={(errors.invoiceNumber) ? "form-control is-invalid" : "form-control"} 
                autoComplete="off" 
                onChange={(e) => {
                  handleChange(e)
                  setFieldTouched("invoiceNumber", true, true)
                }}           
        />
        <ErrorMessage name="invoiceNumber" component="span" className="invalid-feedback" />
      </Form.Group>
      <Form.Group label={t('finance.invoices.date')}>
        <CSDatePicker 
          className={(errors.dateSent) ? "form-control is-invalid" : "form-control"} 
          selected={values.dateSent}
          onChange={(date) => {
            setFieldValue("dateSent", date)
            setFieldTouched("dateSent", true)
          }}
        />
        <ErrorMessage name="dateSent" component="span" className="invalid-feedback" />
      </Form.Group>
      <Form.Group label={t('finance.invoices.due')}>
        <CSDatePicker 
          className={(errors.dateDue) ? "form-control is-invalid" : "form-control"} 
          selected={values.dateDue}
          onChange={(date) => {
            setFieldValue("dateDue", date)
            setFieldTouched("dateDue", true)
          }}
        />
        <ErrorMessage name="dateDue" component="span" className="invalid-feedback" />
      </Form.Group>
      <Form.Group label={t('general.status')}>
        <Field component="select" 
              name="status" 
              className={(errors.status) ? "form-control is-invalid" : "form-control"} 
              autoComplete="off"
              onChange={(e) => {
                handleChange(e)
                setFieldTouched("status", true, true)
              }}
        >
          <option value="DRAFT">{t('finance.invoices.status.DRAFT')}</option>
          <option value="SENT">{t('finance.invoices.status.SENT')}</option>
          <option value="PAID">{t('finance.invoices.status.PAID')}</option>
          <option value="CANCELLED">{t('finance.invoices.status.CANCELLED')}</option>
        </Field>
        <ErrorMessage name="status" component="span" className="invalid-feedback" />
      </Form.Group>
      <Form.Group label={t('general.payment_method')}>
        <Field component="select" 
              name="financePaymentMethod" 
              className={(errors.financePaymentMethod) ? "form-control is-invalid" : "form-control"} 
              onChange={(e) => {
                handleChange(e)
                setFieldTouched("financePaymentMethod", true, true)
              }}
              autoComplete="off">
          <option value="" key={v4()}></option>
          {inputData.financePaymentMethods.edges.map(({ node }) =>
            <option value={node.id} key={v4()}>{node.name}</option>
          )}
        </Field>
        <ErrorMessage name="financePaymentMethod" component="span" className="invalid-feedback" />
      </Form.Group>  
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
    </FoForm>
  </Dimmer>
)

export default withTranslation()(withRouter(FinanceInvoiceEditOptionsForm))