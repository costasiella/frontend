import React from 'react'
import { v4 } from "uuid"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'

import {
  Button,
  Form
} from "tabler-react";


import CSLS from "../../../tools/cs_local_storage"
// import { get_list_query_variables } from './tools'
import CSDatePicker from "../../ui/CSDatePicker"


function FinanceTaxRatesSummaryFilter({ t, history, values, errors, data, isSubmitting, setFieldTouched=f=>f, setFieldValue=f=>f,  refetch }) {
  return (
    <FoForm>
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
      <Button 
        block
        color="primary"
        className="pull-right" 
        type="submit" 
        disabled={isSubmitting}
      >
        {t('finance.taxrates_summary.set_dates')}
      </Button>
    </FoForm>
  )
}

export default withTranslation()(withRouter(FinanceTaxRatesSummaryFilter))