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


function InsightTrialpassesFilter({ t, history, values, errors, isSubmitting }) {
  return (
    <FoForm>
      <Form.Group label={t('general.year')}>
        <Field type="number" 
                name="year" 
                className={(errors.year) ? "form-control is-invalid" : "form-control"} 
                autoComplete="off" />
        <ErrorMessage name="year" component="span" className="invalid-feedback" />
      </Form.Group>
      <Form.Group label={t('general.month')}>
        <Field component="select" 
              name="month" 
              className={(errors.month) ? "form-control is-invalid" : "form-control"} 
              autoComplete="off"
              // onChange={(e) => {
              //   handleChange(e)
              //   setFieldTouched("financeTaxRate", true, true)
              // }}
        >
          <option value="01" key={v4()}>{t("datetime.months.january")}</option>
          <option value="02" key={v4()}>{t("datetime.months.february")}</option>
          <option value="03" key={v4()}>{t("datetime.months.march")}</option>
          <option value="04" key={v4()}>{t("datetime.months.april")}</option>
          <option value="05" key={v4()}>{t("datetime.months.may")}</option>
          <option value="06" key={v4()}>{t("datetime.months.june")}</option>
          <option value="07" key={v4()}>{t("datetime.months.july")}</option>
          <option value="08" key={v4()}>{t("datetime.months.august")}</option>
          <option value="09" key={v4()}>{t("datetime.months.september")}</option>
          <option value="10" key={v4()}>{t("datetime.months.october")}</option>
          <option value="11" key={v4()}>{t("datetime.months.november")}</option>
          <option value="12" key={v4()}>{t("datetime.months.december")}</option>
        </Field>
        <ErrorMessage name="month" component="span" className="invalid-feedback" />
      </Form.Group>
      <Button 
        block
        color="primary"
        className="pull-right" 
        type="submit" 
        disabled={isSubmitting}
      >
        {t('insight.trialpasses.set_month')}
      </Button>
    </FoForm>
  )
}

export default withTranslation()(withRouter(InsightTrialpassesFilter))