import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'
import { Link } from 'react-router-dom'

import {
  Button,
  Card,
  Form,
  Grid,
} from "tabler-react"

import { Editor } from '@tinymce/tinymce-react'
import { tinymceBasicConf } from "../../../../plugin_config/tinymce"


const FinanceInvoiceGroupForm = ({ t, history, isSubmitting, setFieldTouched, setFieldValue, errors, values, returnUrl, edit=false }) => (
  <FoForm>
    <Card.Body>
      <Grid.Row>
        <Grid.Col>
          <Form.Group>
            <Form.Label className="custom-switch">
              <Field 
                className="custom-switch-input"
                type="checkbox" 
                name="displayPublic" 
                checked={values.displayPublic} />
              <span className="custom-switch-indicator" ></span>
              <span className="custom-switch-description">{t('finance.quote_groups.public')}</span>
            </Form.Label>
            <ErrorMessage name="displayPublic" component="div" />   
          </Form.Group>    
        </Grid.Col>
      </Grid.Row>
      <Form.Group label={t('general.name')}>
        <Field type="text" 
                name="name" 
                className={(errors.name) ? "form-control is-invalid" : "form-control"} 
                autoComplete="off" />
        <ErrorMessage name="name" component="span" className="invalid-feedback" />
      </Form.Group>
      <Grid.Row>
        {(edit) ?
        <Grid.Col>
          <Form.Group label={t('finance.quote_groups.next_id')}>
            <Field type="text" 
                    name="nextId" 
                    className={(errors.nextId) ? "form-control is-invalid" : "form-control"} 
                    autoComplete="off" />
            <ErrorMessage name="nextId" component="span" className="invalid-feedback" />
          </Form.Group>
        </Grid.Col> : ""}
        <Grid.Col>
          <Form.Group label={t('finance.quote_groups.expires_after_days')}>
            <Field type="text" 
                    name="expiresAfterDays" 
                    className={(errors.expiresAfterDays) ? "form-control is-invalid" : "form-control"} 
                    autoComplete="off" />
            <ErrorMessage name="expiresAfterDays" component="span" className="invalid-feedback" />
          </Form.Group>
        </Grid.Col>
      </Grid.Row>
      <Form.Group label={t('general.prefix')}>
        <Field type="text" 
                name="prefix" 
                className={(errors.prefix) ? "form-control is-invalid" : "form-control"} 
                autoComplete="off" />
        <ErrorMessage name="prefix" component="span" className="invalid-feedback" />
      </Form.Group>
      <Grid.Row>
        <Grid.Col>
          <Form.Group>
            <Form.Label className="custom-switch">
              <Field 
                className="custom-switch-input"
                type="checkbox" 
                name="prefixYear" 
                checked={values.prefixYear} />
              <span className="custom-switch-indicator" ></span>
              <span className="custom-switch-description">{t('finance.quote_groups.prefix_year')}</span>
            </Form.Label>
            <ErrorMessage name="prefixYear" component="div" />   
          </Form.Group>   
        </Grid.Col>
        <Grid.Col>
          <Form.Group>
            <Form.Label className="custom-switch">
              <Field 
                className="custom-switch-input"
                type="checkbox" 
                name="autoResetPrefixYear" 
                checked={values.autoResetPrefixYear} />
              <span className="custom-switch-indicator" ></span>
              <span className="custom-switch-description">{t('finance.quote_groups.auto_reset_prefix_year')}</span>
            </Form.Label>
            <ErrorMessage name="autoResetPrefixYear" component="div" />   
          </Form.Group>   
        </Grid.Col>
      </Grid.Row>
      <Form.Group label={t('general.terms')}>
        <Editor
          tinymceScriptSrc="/d/static/tinymce/tinymce.min.js"
          textareaName="terms"
          initialValue={values.terms}
          init={tinymceBasicConf}
          onBlur={(e) => {
            setFieldTouched("terms", true, true)
            setFieldValue("terms", e.target.getContent())
          }}
        />
        <ErrorMessage name="terms" component="span" className="invalid-feedback" />
      </Form.Group>
      <Form.Group label={t('general.footer')}>
        <Editor
          tinymceScriptSrc="/d/static/tinymce/tinymce.min.js"
          textareaName="footer"
          initialValue={values.footer}
          init={tinymceBasicConf}
          onBlur={(e) => {
            setFieldTouched("footer", true, true)
            setFieldValue("footer", e.target.getContent())
          }}
        />
        <ErrorMessage name="footer" component="span" className="invalid-feedback" />
      </Form.Group>
      <Form.Group label={t('finance.code')}>
        <Field type="text" 
                name="code" 
                className={(errors.code) ? "form-control is-invalid" : "form-control"} 
                autoComplete="off" />
        <ErrorMessage name="code" component="span" className="invalid-feedback" />
      </Form.Group>
    </Card.Body>
    <Card.Footer>
        <Button 
          color="primary"
          className="pull-right" 
          type="submit" 
          disabled={isSubmitting}
        >
          {t('general.submit')}
        </Button>
        <Link to={returnUrl}>
          <Button 
            type="button" 
            color="link">
              {t('general.cancel')}
          </Button>
        </Link>
    </Card.Footer>
  </FoForm>
)

export default withTranslation()(withRouter(FinanceInvoiceGroupForm))