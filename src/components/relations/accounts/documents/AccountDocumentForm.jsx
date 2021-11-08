// @flow

import React, { useState, useRef } from 'react'
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Form as FoForm, Field, ErrorMessage } from 'formik'
import { v4 } from "uuid"

import {
  Button,
  Card,
  Form,
  Grid,
} from "tabler-react";

const customFileInputLabelStyle = {
  whiteSpace: "nowrap",
  display: "block",
  overflow: "hidden"
}
  

function AccountDocumentForm({ t, history, inputData, isSubmitting, setFieldValue, setFieldTouched, errors, values, returnUrl }) {
  const [fileName, setFileName] = useState(values.fileName)
  const inputFileName = useRef(null)
  const fileInputLabel = fileName || t("general.custom_file_input_inner_label")


  const _handleOnChange = (event) => {
    console.log('on change triggered')
    setFileName(event.target.files[0].name)
  }


  return (
    <FoForm>
      <Card.Body> 
        <Grid.Row>
          <Grid.Col>
            <Form.Group label={t('general.description')}>
              <Field type="text" 
                    name="description" 
                    className={(errors.description) ? "form-control is-invalid" : "form-control"} 
                    autoComplete="off" />
              <ErrorMessage name="description" component="span" className="invalid-feedback" />
            </Form.Group>
          </Grid.Col>
        </Grid.Row> 
        <Grid.Row>
          <Grid.Col>
            <Form.Group label={t('general.custom_file_input_label')}>
              <div className="custom-file">
                <input type="file" ref={inputFileName} className="custom-file-input" onChange={_handleOnChange} />
                <label className="custom-file-label" style={customFileInputLabelStyle}>
                  {fileInputLabel}
                </label>
              </div>
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
          <Button
            type="button" 
            color="link" 
            onClick={() => history.push(returnUrl)}
          >
            {t('general.cancel')}
          </Button>
      </Card.Footer>
    </FoForm>
  )
}

)


export default withTranslation()(withRouter(AccountDocumentForm))