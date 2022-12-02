import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'
import { v4 } from "uuid"

import {
  Card,
  Form,
} from "tabler-react";

import ButtonFormCancel from '../../../ui/ButtonFormCancel'
import ButtonFormSubmit from '../../../ui/ButtonFormSubmit'


const B2BInvoiceAddForm = ({ t, inputData, isSubmitting, errors, returnUrl }) => (
  <FoForm>
    <Card.Body>
      <Form.Group label={t('general.finance_invoice_group')}>
        <Field component="select" 
              name="financeInvoiceGroup" 
              className={(errors.financeInvoiceGroup) ? "form-control is-invalid" : "form-control"} 
              autoComplete="off">
          {/* <option value="" key={v4()}>{t('general.please_select')}</option> */}
          {inputData.financeInvoiceGroups.edges.map(({ node }) =>
            <option value={node.id} key={v4()}>{node.name}</option>
          )}
        </Field>
        <ErrorMessage name="financeInvoiceGroup" component="span" className="invalid-feedback" />
      </Form.Group>
      <Form.Group label={t('general.summary')}>
        <Field type="text" 
                name="summary" 
                className={(errors.summary) ? "form-control is-invalid" : "form-control"} 
                autoComplete="off" />
        <ErrorMessage name="summary" component="span" className="invalid-feedback" />
      </Form.Group>
    </Card.Body>
    <Card.Footer>
      <ButtonFormSubmit disabled={isSubmitting} />
      <ButtonFormCancel returnUrl={returnUrl} />
    </Card.Footer>
  </FoForm>
)


export default withTranslation()(withRouter(B2BInvoiceAddForm))