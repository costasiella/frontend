// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'
import { v4 } from "uuid"
import { Link } from "react-router-dom"

import { Editor } from '@tinymce/tinymce-react'
import { tinymceBasicConf } from "../../../plugin_config/tinymce"


import {
  Button,
  Card,
  Form,
  Grid
} from "tabler-react";


const OrganizationSubscriptionForm = ({ t, history, inputData, isSubmitting, setFieldValue, setFieldTouched, errors, values, returnUrl }) => (
  <FoForm>
    <Card.Body> 
      <Form.Group>
        <Form.Label className="custom-switch">
            <Field 
              className="custom-switch-input"
              type="checkbox" 
              name="displayPublic" 
              checked={values.displayPublic} />
            <span className="custom-switch-indicator" ></span>
            <span className="custom-switch-description">{t('organization.subscription.public')}</span>
          </Form.Label>
        <ErrorMessage name="displayPublic" component="div" />   
      </Form.Group>      
      <Form.Group>
        <Form.Label className="custom-switch">
            <Field 
              className="custom-switch-input"
              type="checkbox" 
              name="displayShop" 
              checked={values.displayShop} />
            <span className="custom-switch-indicator" ></span>
            <span className="custom-switch-description">{t('organization.subscription.shop')}</span>
          </Form.Label>
        <ErrorMessage name="displayShop" component="div" />   
      </Form.Group>      
      <Form.Group label={t('general.name')} >
        <Field type="text" 
              name="name" 
              className={(errors.name) ? "form-control is-invalid" : "form-control"} 
              autoComplete="off" />
        <ErrorMessage name="name" component="span" className="invalid-feedback" />
      </Form.Group>
      <Form.Group label={t('general.description')}>
        <Editor
            tinymceScriptSrc="/d/static/tinymce/tinymce.min.js"
            textareaName="description"
            initialValue={values.description}
            init={tinymceBasicConf}
            onBlur={(e) => {
              setFieldValue("description", e.target.getContent())
              setFieldTouched("description", true)
            }}
          />
        <ErrorMessage name="description" component="span" className="invalid-feedback" />
      </Form.Group>
      <Grid.Row>
        <Grid.Col>
          <Form.Group label={t('shop.subscriptions.min_duration_in_months')}>
            <Field type="text" 
                  name="minDuration" 
                  className={(errors.minDuration) ? "form-control is-invalid" : "form-control"} 
                  autoComplete="off" />
            <ErrorMessage name="minDuration" component="span" className="invalid-feedback" />
          </Form.Group>
        </Grid.Col>
        <Grid.Col>
          <Form.Group label={t('general.sort_order')}>
            <Field type="text" 
                  name="sortOrder" 
                  className={(errors.sortOrder) ? "form-control is-invalid" : "form-control"} 
                  autoComplete="off" />
            <ErrorMessage name="sortOrder" component="span" className="invalid-feedback" />
          </Form.Group>
        </Grid.Col>
      </Grid.Row>
      <Form.Group>
        <Form.Label className="custom-switch">
            <Field 
              className="custom-switch-input"
              type="checkbox" 
              name="unlimited" 
              checked={values.unlimied} />
            <span className="custom-switch-indicator" ></span>
            <span className="custom-switch-description">{t('general.unlimited')}</span>
          </Form.Label>
        <ErrorMessage name="unlimited" component="div" />   
      </Form.Group>  
      {/* Show if unlimited */}
      { (values.unlimited) ? ""
        : 
        // Show if not unlimited
        <React.Fragment>
          <Grid.Row>
            <Grid.Col>
              <Form.Group label={t('general.classes')}>
                <Field type="text" 
                      name="classes" 
                      className={(errors.classes) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off" />
                <ErrorMessage name="classes" component="span" className="invalid-feedback" />
              </Form.Group> 
            </Grid.Col>
            <Grid.Col>
              <Form.Group label={t('general.subscription_unit')}>
                <Field component="select" 
                      name="subscriptionUnit" 
                      className={(errors.subscriptionUnit) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off">
                  <option value="WEEK" key={v4()}>{t('subscription_unit.week')}</option>
                  <option value="MONTH" key={v4()}>{t('subscription_unit.month')}</option>
                </Field>
                <ErrorMessage name="subscriptionUnit" component="span" className="invalid-feedback" />
              </Form.Group>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row>
            <Grid.Col>
              <Form.Group label={t('organization.subscriptions.credit_accumulation_days')}>
                <Field type="text" 
                      name="creditAccumulationDays" 
                      className={(errors.creditAccumulationDays) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off" />
                <ErrorMessage name="creditAccumulationDays" component="span" className="invalid-feedback" />
              </Form.Group>
            </Grid.Col>
            <Grid.Col>
              <Form.Group label={t('organization.subscriptions.reconciliation_classes')}>
                <Field type="text" 
                      name="reconciliationClasses" 
                      className={(errors.reconciliationClasses) ? "form-control is-invalid" : "form-control"} 
                      autoComplete="off" />
                <ErrorMessage name="reconciliationClasses" component="span" className="invalid-feedback" />
              </Form.Group>
            </Grid.Col>
          </Grid.Row>
        </React.Fragment>
      } 
      <Form.Group label={t('general.terms_and_conditions')}>
        <Editor
            tinymceScriptSrc="/d/static/tinymce/tinymce.min.js"
            textareaName="termsAndConditions"
            initialValue={values.termsAndConditions}
            init={tinymceBasicConf}
            onBlur={(e) => {
              setFieldValue("termsAndConditions", e.target.getContent())
              setFieldTouched("termsAndConditions", true)
            }}
          />
        <ErrorMessage name="termsAndConditions" component="span" className="invalid-feedback" />
      </Form.Group>
      {/* <Form.Group label={t('general.membership')}>
        <Field component="select" 
              name="organizationMembership" 
              className={(errors.organizationMembership) ? "form-control is-invalid" : "form-control"} 
              autoComplete="off">
          <option value="" key={v4()}>{t("general.membership_not_required")}</option>
          {inputData.organizationMemberships.edges.map(({ node }) =>
            <option value={node.id} key={v4()}>{node.name} ({node.code})</option>
          )}
        </Field>
        <ErrorMessage name="organizationMembership" component="span" className="invalid-feedback" />
      </Form.Group>  */}
      <Form.Group label={t('general.quickStatsAmount')}>
        <Field type="text" 
              name="quickStatsAmount" 
              className={(errors.quickStatsAmount) ? "form-control is-invalid" : "form-control"} 
              autoComplete="off" />
        <ErrorMessage name="quickStatsAmount" component="span" className="invalid-feedback" />
      </Form.Group>
      <Grid.Row>
        <Grid.Col>
          <Form.Group label={t('general.glaccount')}>
            <Field component="select" 
                  name="financeGlaccount" 
                  className={(errors.financeGlaccount) ? "form-control is-invalid" : "form-control"} 
                  autoComplete="off">
              <option value="" key={v4()}></option>
              {inputData.financeGlaccounts.edges.map(({ node }) =>
                <option value={node.id} key={v4()}>{node.name} ({node.code})</option>
              )}
            </Field>
            <ErrorMessage name="financeGlaccount" component="span" className="invalid-feedback" />
          </Form.Group>
        </Grid.Col>
        <Grid.Col>
          <Form.Group label={t('general.costcenter')}>
            <Field component="select" 
                  name="financeCostcenter" 
                  className={(errors.financeCostcenter) ? "form-control is-invalid" : "form-control"} 
                  autoComplete="off">
              <option value="" key={v4()}></option>
              {inputData.financeCostcenters.edges.map(({ node }) =>
                <option value={node.id} key={v4()}>{node.name} ({node.code})</option>
              )}
            </Field>
            <ErrorMessage name="financeCostcenter" component="span" className="invalid-feedback" />
          </Form.Group>
        </Grid.Col>
      </Grid.Row>
    </Card.Body>
    <Card.Footer>
        <Button 
          className="pull-right"
          color="primary"
          disabled={isSubmitting}
          type="submit"
        >
          {t('general.submit')}
        </Button>
        <Link to={returnUrl}>
          <Button
            type="button" 
            color="link"
          >
              {t('general.cancel')}
          </Button>
        </Link>
    </Card.Footer>
  </FoForm>
)


export default withTranslation()(withRouter(OrganizationSubscriptionForm))