import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'

import {
  Button,
  Dimmer,
  Form,
} from "tabler-react"

import CSDatePicker from "../../../ui/CSDatePicker"


const FinanceQuoteEditOptionsForm = ({ t, isSubmitting, values, errors, handleChange, touched, setFieldValue, setFieldTouched, inputData }) => (
  <Dimmer loader={isSubmitting} active={isSubmitting}>
    <FoForm>
      <Form.Group label={t('finance.quotes.quote_number')}>
        <Field type="text" 
                name="quoteNumber" 
                className={(errors.quoteNumber) ? "form-control is-invalid" : "form-control"} 
                autoComplete="off" 
                onChange={(e) => {
                  handleChange(e)
                  setFieldTouched("quoteNumber", true, true)
                }}           
        />
        <ErrorMessage name="quoteNumber" component="span" className="invalid-feedback" />
      </Form.Group>
      <Form.Group label={t('finance.quotes.date')}>
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
      <Form.Group label={t('finance.quotes.expiration')}>
        <CSDatePicker 
          className={(errors.dateExpire) ? "form-control is-invalid" : "form-control"} 
          selected={values.dateExpire}
          onChange={(date) => {
            setFieldValue("dateExpire", date)
            setFieldTouched("dateExpire", true)
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
          <option value="DRAFT">{t('finance.quotes.status.DRAFT')}</option>
          <option value="SENT">{t('finance.quotes.status.SENT')}</option>
          <option value="ACCEPTED">{t('finance.quotes.status.ACCEPTED')}</option>
          <option value="REJECTED">{t('finance.quotes.status.REJECTED')}</option>
          <option value="CANCELLED">{t('finance.quotes.status.CANCELLED')}</option>
        </Field>
        <ErrorMessage name="status" component="span" className="invalid-feedback" />
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

export default withTranslation()(withRouter(FinanceQuoteEditOptionsForm))