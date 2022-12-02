import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'
import { v4 } from "uuid"
import {
  Card,
  Form,
  Grid,
} from "tabler-react"

import ButtonFormCancel from '../../../ui/ButtonFormCancel'
import ButtonFormSubmit from '../../../ui/ButtonFormSubmit'


const FinanceInvoiceEditToForm = ({ t, history, isSubmitting, errors, values, setFieldValue, setFieldTouched, inputData, returnUrl }) => (
  <FoForm>
    <Card.Body>
      <Form.Group>
        <Form.Label className="custom-switch">
          <Field 
            className="custom-switch-input"
            type="checkbox" 
            name="customer" 
            checked={values.customTo} 
            onChange={ (event) => {
              setFieldTouched('customTo', true, true)
              setFieldValue('customTo', !(values.customTo))
            }}
          />
            <span className="custom-switch-indicator" ></span>
            <span className="custom-switch-description">{t('finance.invoices.edit_to.custom_to')}</span>
        </Form.Label>
        <ErrorMessage name="customTo" component="div" />   
      </Form.Group>  
      { !(values.customTo)  ?
          <Form.Group label={t('relations.accounts.invoice_to_business')}>
            <Field component="select" 
                  name="business" 
                  className={(errors.business) ? "form-control is-invalid" : "form-control"} 
                  autoComplete="off">
              {(inputData.financeInvoice.account) &&
                <option value="" key={v4()}>{t('relations.accounts.invoice_to_account')}: {inputData.financeInvoice.account.fullName}</option>
              }
              {inputData.businesses.edges.map(({ node }) =>
                <option value={node.id} key={v4()}>{node.name}</option>
              )}
            </Field>
            <ErrorMessage name="business" component="span" className="invalid-feedback" />
          </Form.Group>
      : 
        <>
          <Form.Group label={t("finance.invoices.relation_company")}>
            <Field type="text" 
                    name="relationCompany" 
                    className={(errors.relationCompany) ? "form-control is-invalid" : "form-control"} 
                    autoComplete="off"     
            />
            <ErrorMessage name="relationCompany" component="span" className="invalid-feedback" />
          </Form.Group>
          <Grid.Row>
            <Grid.Col md={6}>
              <Form.Group label={t("finance.invoices.relation_company_registration")}>
                <Field type="text" 
                        name="relationCompanyRegistration" 
                        className={(errors.relationCompanyRegistration) ? "form-control is-invalid" : "form-control"} 
                        autoComplete="off" 
                />
                <ErrorMessage name="relationCompanyRegistration" component="span" className="invalid-feedback" />
              </Form.Group>
            </Grid.Col>
            <Grid.Col md={6}>
              <Form.Group label={t("finance.invoices.relation_company_tax_registration")}>
                <Field type="text" 
                        name="relationCompanyTaxRegistration" 
                        className={(errors.relationCompanyTaxRegistration) ? "form-control is-invalid" : "form-control"} 
                        autoComplete="off" 
                />
                <ErrorMessage name="relationCompanyTaxRegistration" component="span" className="invalid-feedback" />
              </Form.Group>
            </Grid.Col>
          </Grid.Row>
          <Form.Group label={t("finance.invoices.relation_contact_name")}>
            <Field type="text" 
                    name="relationContactName" 
                    className={(errors.relationContactName) ? "form-control is-invalid" : "form-control"} 
                    autoComplete="off" 
            />
            <ErrorMessage name="relationContactName" component="span" className="invalid-feedback" />
          </Form.Group>
          <Grid.Row>
            <Grid.Col md={6}>
              <Form.Group label={t("finance.invoices.relation_address")}>
                <Field type="text" 
                        name="relationAddress" 
                        className={(errors.relationAddress) ? "form-control is-invalid" : "form-control"} 
                        autoComplete="off" 
                />
                <ErrorMessage name="relationAddress" component="span" className="invalid-feedback" />
              </Form.Group>
            </Grid.Col>
            <Grid.Col md={6}>
              <Form.Group label={t("finance.invoices.relation_postcode")}>
                <Field type="text" 
                        name="relationPostcode" 
                        className={(errors.relationPostcode) ? "form-control is-invalid" : "form-control"} 
                        autoComplete="off" 
                />
                <ErrorMessage name="relationPostcode" component="span" className="invalid-feedback" />
              </Form.Group>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col md={6}>
              <Form.Group label={t("finance.invoices.relation_city")}>
                <Field type="text" 
                        name="relationCity" 
                        className={(errors.relationCity) ? "form-control is-invalid" : "form-control"} 
                        autoComplete="off" 
                />
                <ErrorMessage name="relationCity" component="span" className="invalid-feedback" />
              </Form.Group>
            </Grid.Col>
            <Grid.Col md={6}>
              <Form.Group label={t("finance.invoices.relation_country")}>
                <Field type="text" 
                        name="relationCountry" 
                        className={(errors.relationCountry) ? "form-control is-invalid" : "form-control"} 
                        autoComplete="off" 
                />
                <ErrorMessage name="relationCountry" component="span" className="invalid-feedback" />
              </Form.Group>
            </Grid.Col>
          </Grid.Row>
        </>
      }
    </Card.Body>
    <Card.Footer>
      <ButtonFormSubmit disabled={isSubmitting} />
      <ButtonFormCancel returnUrl={returnUrl} />
    </Card.Footer>
  </FoForm>
)

export default withTranslation()(withRouter(FinanceInvoiceEditToForm))