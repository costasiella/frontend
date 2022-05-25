import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, ErrorMessage } from 'formik'

import {
  Card,
  Form,
} from "tabler-react"

import ButtonFormSubmit from '../../ui/ButtonFormSubmit'
import ButtonFormCancel from '../../ui/ButtonFormCancel'
import CSDatePicker from "../../ui/CSDatePicker"


const InsightInactiveAccountsForm = ({ t, history, isSubmitting, errors, values, setFieldTouched, setFieldValue, returnUrl }) => (
  <FoForm>
      <Card.Body>
        {console.log(values)}
        <Form.Group label={t("insight.inactive_accounts.no_activity_after_date")}>
          <CSDatePicker 
            className={(errors.noActivityAfterDate) ? "form-control is-invalid" : "form-control"} 
            selected={values.noActivityAfterDate}
            onChange={(date) => {
              setFieldValue("noActivityAfterDate", date)
              setFieldTouched("noActivityAfterDate", true)
            }}
            onBlur={() => setFieldTouched("noActivityAfterDate", true)}
          />
          <ErrorMessage name="noActivityAfterDate" component="span" className="invalid-feedback" />
        </Form.Group>
      </Card.Body>
      <Card.Footer>
          <ButtonFormSubmit disabled={isSubmitting} />
          <ButtonFormCancel returnUrl={returnUrl} />
      </Card.Footer>
  </FoForm>
)

export default withTranslation()(withRouter(InsightInactiveAccountsForm))