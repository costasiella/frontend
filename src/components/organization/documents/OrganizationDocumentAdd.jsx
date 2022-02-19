import React, { useState, useRef } from 'react'
import { useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { 
  Formik,
  Form as FoForm, 
  Field, 
  ErrorMessage 
} from 'formik'
import { toast } from 'react-toastify'
import {
  Grid,
  Button,
  Card,
  Form,
} from "tabler-react"

import { ADD_DOCUMENT, GET_DOCUMENTS_QUERY } from "./queries"
import { dateToLocalISO } from "../../../tools/date_tools"
import ButtonBack from '../../ui/ButtonBack'
import CSDatePicker from "../../ui/CSDatePicker"

import OrganizationDocumentsBase from "./OrganizationDocumentsBase"
import { getSubtitle } from './tools'


const customFileInputLabelStyle = {
  whiteSpace: "nowrap",
  display: "block",
  overflow: "hidden"
}  


function OrganizationDocumentAdd({ t, match, history }) {
  const organizationId = match.params.organization_id
  const documentType = match.params.document_type
  const subTitle = getSubtitle(t, documentType)

  // Vars for document file input field start
  const [fileName, setFileName] = useState("")
  const inputFileName = useRef(null)
  const fileInputLabel = fileName || t("general.custom_file_input_inner_label")

  const handleFileInputChange = (event) => {
    console.log('on change triggered')
    setFileName(event.target.files[0].name)
  }

  // Vars for document file input field end
  
  const returnUrl = `/organization/documents/${organizationId}/${documentType}`
  const pageHeaderButtonList = <ButtonBack returnUrl={returnUrl} />

  const [addDocument] = useMutation(ADD_DOCUMENT, {
    onCompleted: () => history.push(returnUrl)
  })

  return (
    <OrganizationDocumentsBase pageHeaderButtonList={pageHeaderButtonList}>
      <Card title={t('organization.documents.add') + ' - ' + subTitle}>
        <Formik
          initialValues={{ 
            version: '',
            dateStart: '', 
            dateEnd: '',
            document: ''
          }}
          // validationSchema={DOCUMENT_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
            console.log("Submit values")
            console.log(values)
            console.log(fileName)

            let inputVars = {
              documentType: documentType,
              version: values.version,
              dateStart: dateToLocalISO(values.dateStart),
              documentFileName: fileName,
            }

            if (values.dateEnd) {
              inputVars.dateEnd = dateToLocalISO(values.dateEnd)
            }

            let reader = new FileReader()
            reader.onload = function(reader_event) {
              console.log(reader_event.target.result)
              let b64_enc_file = reader_event.target.result
              console.log(b64_enc_file)
              // Add uploaded document b64 encoded blob to input vars
              inputVars.document = b64_enc_file

              addDocument({ variables: {
                input: inputVars
              }, refetchQueries: [
                  {query: GET_DOCUMENTS_QUERY, variables: {documentType: documentType}}
              ]})
              .then(({ data }) => {
                  console.log('got data', data);
                  toast.success((t('organization.documents.toast_add_success')), {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                    setSubmitting(false)
                }).catch((error) => {
                  toast.error((t('general.toast_server_error')) +  error, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  console.log('there was an error sending the query', error)
                  setSubmitting(false)
                })
            }
            
            let file = inputFileName.current.files[0]
            reader.readAsDataURL(file)
          }}
          >
          {({ isSubmitting, errors, values, setFieldTouched, setFieldValue }) => (
            <FoForm>
            <Card.Body>
              <Grid.Row>
                <Grid.Col>
                  <Form.Group label={t('general.version')}>
                    <Field type="text" 
                          name="version" 
                          className={(errors.version) ? "form-control is-invalid" : "form-control"} 
                          autoComplete="off" />
                    <ErrorMessage name="version" component="span" className="invalid-feedback" />
                  </Form.Group>
                </Grid.Col>
                <Grid.Col>
                  <Form.Group label={t('general.custom_file_input_label')}>
                    <div className="custom-file">
                      <input type="file" ref={inputFileName} className="custom-file-input" onChange={handleFileInputChange} />
                      <label className="custom-file-label" style={customFileInputLabelStyle}>
                        {fileInputLabel}
                      </label>
                    </div>
                  </Form.Group>
                </Grid.Col>
              </Grid.Row>
              <Grid.Row>
                <Grid.Col>
                  <Form.Group label={t('general.date_start')}>
                    <CSDatePicker 
                      selected={values.dateStart}
                      onChange={(date) => setFieldValue("dateStart", date)}
                      onBlur={() => setFieldTouched("dateStart", true)}
                    />
                    <ErrorMessage name="dateStart" component="span" className="invalid-feedback" />
                  </Form.Group>
                </Grid.Col>
                <Grid.Col>
                  <Form.Group label={t('general.date_end')}>
                    <CSDatePicker 
                      selected={values.dateEnd}
                      onChange={(date) => setFieldValue("dateEnd", date)}
                      onBlur={() => setFieldTouched("dateEnd", true)}
                    />
                    <ErrorMessage name="dateEnd" component="span" className="invalid-feedback" />
                  </Form.Group>
                </Grid.Col>
              </Grid.Row>
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
              <Button color="link" onClick={() => history.push(returnUrl)}>
                {t('general.cancel')}
              </Button>
            </Card.Footer>
          </FoForm>
          )}
        </Formik>
      </Card>
    </OrganizationDocumentsBase>
  )
}

export default withTranslation()(withRouter(OrganizationDocumentAdd))

