// @flow

import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'


import {
  Button,
  Dimmer,
  Form,
} from "tabler-react"

import { Editor } from '@tinymce/tinymce-react'
import { tinymceBasicConf } from "../../../../plugin_config/tinymce"


// Use editor as controlled component:
// https://github.com/tinymce/tinymce-react/blob/master/README.md

const FinanceInvoiceEditFooterForm = ({ t, isSubmitting, values, errors, touched, handleChange, setFieldTouched, setFieldValue }) => (
  <Dimmer loader={isSubmitting} active={isSubmitting}>
    <FoForm>
      <Form.Group label={t('general.footer')}>
        <Editor
          tinymceScriptSrc="/d/static/tinymce/tinymce.min.js"
          textareaName="footer"
          initialValue={values.footer}
          init={tinymceBasicConf}
          onBlur={(e) => {
            setFieldValue("footer", e.target.getContent())
            setFieldTouched("footer", true, true)
          }}
        />
        <ErrorMessage name="footer" component="span" className="invalid-feedback" />
      </Form.Group>
      <Button 
        color="primary"
        className="pull-right" 
        type="submit" 
        disabled={isSubmitting}
      >
        {t('general.submit')}
      </Button>
    </FoForm>
  </Dimmer>
)

export default withTranslation()(withRouter(FinanceInvoiceEditFooterForm))