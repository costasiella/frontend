import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, ErrorMessage } from 'formik'

import {
  Button,
  Form,
  Grid
} from "tabler-react";

import CSDatePicker from "../../ui/CSDatePicker"


function InsightFinanceInvoicesOpenOnDateFilter({ t, history, values, errors, data, isSubmitting, setFieldTouched=f=>f, setFieldValue=f=>f,  refetch }) {
  console.log(errors)
  return (
    <FoForm>
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
              // onBlur={() => setFieldTouched("dateStart", true)}
            />
            <ErrorMessage name="datet" component="span" className="invalid-feedback" />
          </Form.Group>
        </Grid.Col>
        <Grid.Col>
          <br />
          <Button 
            block
            color="primary"
            className="pull-right mt-1" 
            type="submit" 
            disabled={isSubmitting}
          >
            {t('insight.invoicesopenondate.generate_report')}
          </Button>
        </Grid.Col>
      </Grid.Row>
    </FoForm>
  )
}

export default withTranslation()(withRouter(InsightFinanceInvoicesOpenOnDateFilter))