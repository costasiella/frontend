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


function FinanceTaxRatesSummaryFilter({ t, history, values, errors, data, isSubmitting, setFieldTouched=f=>f, setFieldValue=f=>f,  refetch }) {
  return (
    <FoForm>
      <Grid.Row>
        <Grid.Col>
          <Form.Group label={t('general.date_start')}>
            <CSDatePicker 
              className={(errors.dateStart) ? "form-control is-invalid" : "form-control"} 
              selected={values.dateStart}
              onChange={(date) => {
                setFieldValue("dateStart", date)
                setFieldTouched("dateStart", true)
              }}
            />
            <ErrorMessage name="dateStart" component="span" className="invalid-feedback" />
          </Form.Group>
        </Grid.Col>
        <Grid.Col>
          <Form.Group label={t('general.date_end')}>
            <CSDatePicker 
              className={(errors.dateEnd) ? "form-control is-invalid" : "form-control"} 
              selected={values.dateEnd}
              onChange={(date) => {
                setFieldValue("dateEnd", date)
                setFieldTouched("dateEnd", true)
              }}
            />
            <ErrorMessage name="dateEnd" component="span" className="invalid-feedback" />
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
            {t('finance.taxrates_summary.set_dates')}
          </Button>
        </Grid.Col>
      </Grid.Row>
    </FoForm>
  )
}

export default withTranslation()(withRouter(FinanceTaxRatesSummaryFilter))