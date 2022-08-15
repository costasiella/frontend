import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'
import { v4 } from "uuid"
import {
  Button,
  Card,
  Dimmer,
  Form,
  Grid,
} from "tabler-react"

import ButtonFormCancel from '../../../ui/ButtonFormCancel'
import ButtonFormSubmit from '../../../ui/ButtonFormSubmit'


const FinanceInvoiceEditToForm = ({ t, history, isSubmitting, errors, touched, handleChange, setFieldTouched, inputData, returnUrl }) => (
  <FoForm>
    <Card.Body>
        <Form.Group label={t("finance.invoices.relation_company")}>
          <Field type="text" 
                  name="relationCompany" 
                  className={(errors.relationCompany) ? "form-control is-invalid" : "form-control"} 
                  autoComplete="off" 
                  onChange={(e) => {
                    handleChange(e)
                    setFieldTouched("relationCompany", true, true)
                  }}           
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
                      onChange={(e) => {
                        handleChange(e)
                        setFieldTouched("relationCompanyRegistartion", true, true)
                      }} 
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
                      onChange={(e) => {
                        handleChange(e)
                        setFieldTouched("relationCompanyTaxRegistration", true, true)
                      }}
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
                  onChange={(e) => {
                    handleChange(e)
                    setFieldTouched("relationContactName", true, true)
                  }}
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
                      onChange={(e) => {
                        handleChange(e)
                        setFieldTouched("relationAddress", true, true)
                      }} 
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
                      onChange={(e) => {
                        handleChange(e)
                        setFieldTouched("relationPostcode", true, true)
                      }}
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
                      onChange={(e) => {
                        handleChange(e)
                        setFieldTouched("relationCity", true, true)
                      }}
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
                      onChange={(e) => {
                        handleChange(e)
                        setFieldTouched("relationCountry", true, true)
                      }}
              />
              <ErrorMessage name="relationCountry" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
        </Grid.Row>
        <Form.Group label={t('relations.accounts.invoice_to_business')}>
          <Field component="select" 
                name="business" 
                className={(errors.business) ? "form-control is-invalid" : "form-control"} 
                onChange={(e) => {
                  handleChange(e)
                  setFieldTouched("business", true, true)
                }}
                autoComplete="off">
            <option value="" key={v4()}>{t('relations.accounts.invoice_to_account')}</option>
            {inputData.businesses.edges.map(({ node }) =>
              <option value={node.id} key={v4()}>{node.name}</option>
            )}
          </Field>
          <ErrorMessage name="business" component="span" className="invalid-feedback" />
        </Form.Group>
      </Card.Body>
      <Card.Footer>
        <ButtonFormSubmit disabled={isSubmitting} />
        <ButtonFormCancel returnUrl={returnUrl} />
      </Card.Footer>
    </FoForm>
)

export default withTranslation()(withRouter(FinanceInvoiceEditToForm))