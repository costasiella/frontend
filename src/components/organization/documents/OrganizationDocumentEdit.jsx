import React from 'react'
import { withTranslation } from 'react-i18next';
import { useMutation, useQuery } from "@apollo/client";
import { 
  Formik,
  Form as FoForm, 
  Field, 
  ErrorMessage 
} from 'formik'
import { toast } from 'react-toastify'

import { UPDATE_DOCUMENT, GET_DOCUMENT_QUERY, GET_DOCUMENTS_QUERY } from "./queries"
import { dateToLocalISO } from "../../../tools/date_tools"
import ButtonBack from '../../ui/ButtonBack'
import CSDatePicker from "../../ui/CSDatePicker"

import {
  Grid,
  Button,
  Card,
  Form,
} from "tabler-react"

import OrganizationDocumentsBase from "./OrganizationDocumentsBase"
import { getSubtitle } from './tools'


function OrganizationDocumentEdit({ t, match, history }) {
  const organizationId = match.params.organization_id
  const documentType = match.params.document_type
  const id = match.params.id
  const subTitle = getSubtitle(t, documentType)
  
  const returnUrl = `/organization/documents/${organizationId}/${documentType}`
  const pageHeaderButtonList = <ButtonBack returnUrl={returnUrl} />

  const [ updateDocument ] = useMutation(UPDATE_DOCUMENT, {
    onCompleted: () => history.push(returnUrl)
  })
  const { loading, error, data } = useQuery(GET_DOCUMENT_QUERY, {
    variables: { "id": id }
  })

  if (loading) {
    return (
      <OrganizationDocumentsBase pageHeaderButtonList={pageHeaderButtonList}>
        {t("general.loading_with_dots")}
      </OrganizationDocumentsBase>
    )
  }

  if (error) {
    return (
      <OrganizationDocumentsBase pageHeaderButtonList={pageHeaderButtonList}>
        {t("organization.documents.error_loading")}
      </OrganizationDocumentsBase>
    )
  }

  // DatePicker doesn't like a string as an initial value
  // This makes it a happy DatePicker :)
  let dateEnd = null
  if (data.organizationDocument.dateEnd) {
    dateEnd = new Date(data.organizationDocument.dateEnd)
  }

  return (
    <OrganizationDocumentsBase pageHeaderButtonList={pageHeaderButtonList}>
      <Card>
        <Card.Header>
          <Card.Title>
            {t('organization.documents.edit') + ' - ' + subTitle}
          </Card.Title>
        </Card.Header>
        <Formik
          initialValues={{ 
            version: data.organizationDocument.version,
            dateStart: new Date(data.organizationDocument.dateStart), 
            dateEnd: dateEnd,
          }}
          // validationSchema={DOCUMENT_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
            console.log("Submit values")
            console.log(values)

            let inputVars = {
              id: id,
              version: values.version,
              dateStart: dateToLocalISO(values.dateStart),
            }

            if (values.dateEnd) {
              inputVars.dateEnd = dateToLocalISO(values.dateEnd)
            }

            updateDocument({ variables: {
              input: inputVars
            }, refetchQueries: [
                {query: GET_DOCUMENTS_QUERY, variables: {documentType: documentType}}
            ]})
            .then(({ data }) => {
                console.log('got data', data);
                toast.success((t('organization.documents.toast_edit_success')), {
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
                {/* <Grid.Col>
                  <Form.Group label={t('general.custom_file_input_label')}>
                    <div className="custom-file">
                      <input type="file" ref={inputFileName} className="custom-file-input" onChange={handleFileInputChange} />
                      <label className="custom-file-label" style={customFileInputLabelStyle}>
                        {fileInputLabel}
                      </label>
                    </div>
                  </Form.Group>
                </Grid.Col> */}
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

export default withTranslation()(OrganizationDocumentEdit)
