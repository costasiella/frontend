// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'


import {
  Button,
  Dimmer,
  Form,
} from "tabler-react"


let summaryFormTypingTimer
const formSubmitTimeout = 750


const FinanceInvoiceEditSummaryForm = ({ t, isSubmitting, errors, touched, setFieldTouched, handleChange }) => (
  <Dimmer loader={isSubmitting} active={isSubmitting}>
    <FoForm>
      <Form.Group>
        <Field 
          type="text" 
          name="summary" 
          className={(errors.summary) ? "form-control is-invalid" : "form-control"} 
          autoComplete="off" 
          onChange={(e) => {
            handleChange(e)
            setFieldTouched("summary", true, true)
          }}
        />
        <ErrorMessage name="summary" component="span" className="invalid-feedback" />
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

export default withTranslation()(withRouter(FinanceInvoiceEditSummaryForm))