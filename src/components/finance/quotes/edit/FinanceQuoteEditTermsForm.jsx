import React from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, ErrorMessage } from 'formik'


import {
  Button,
  Dimmer,
  Form,
} from "tabler-react"

import { Editor } from '@tinymce/tinymce-react'
import { tinymceBasicConf } from "../../../../plugin_config/tinymce"


// Use editor as controlled component:
// https://github.com/tinymce/tinymce-react/blob/master/README.md
const FinanceQuoteEditTermsForm = ({ t, isSubmitting, values, errors, touched, handleChange, setFieldTouched, setFieldValue }) => (
  <Dimmer loader={isSubmitting} active={isSubmitting}>
    <FoForm>
      <Form.Group label={t('general.terms_and_conditions')}>
        <Editor
          tinymceScriptSrc="/d/static/tinymce/tinymce.min.js"
          textareaName="terms"
          initialValue={values.terms}
          init={tinymceBasicConf}
          onBlur={(e) => {
            setFieldValue("terms", e.target.getContent())
            setFieldTouched("terms", true, true)
          }}
        />
        <ErrorMessage name="terms" component="span" className="invalid-feedback" />
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

export default withTranslation()(withRouter(FinanceQuoteEditTermsForm))