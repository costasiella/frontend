// @flow

import React, { useState, useRef } from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { 
  Formik,
  Form as FoForm, 
  Field, 
  ErrorMessage 
} from 'formik'


import { GET_CLASSTYPES_QUERY, GET_CLASSTYPE_QUERY, UPDATE_CLASSTYPE_IMAGE } from './queries'
import { CLASSTYPE_SCHEMA } from './yupSchema'

import {
  Dimmer,
  Grid,
  Icon,
  Button,
  Card,
  Container,
  Form,
} from "tabler-react";

import ContentCard from "../../general/ContentCard"
import OrganizationClasstypesBase from './OrganizationClasstypesBase';


const customFileInputLabelStyle = {
  whiteSpace: "nowrap",
  display: "block",
  overflow: "hidden"
}


function OrganizationClasstypeEditImage({t, history, match}) {
  const classtypeId = match.params.id
  const returnUrl = "/organization/classtypes"
  const cardTitle = t('organization.classtypes.edit_image')
  const { loading, error, data } = useQuery(GET_CLASSTYPE_QUERY, {
    variables: { id: classtypeId }
  })
  const [ uploadImage ] = useMutation(UPDATE_CLASSTYPE_IMAGE)

  // Vars for document file input field start
  const [fileName, setFileName] = useState("")
  const inputFileName = useRef(null)
  const fileInputLabel = fileName || t("general.custom_file_input_inner_label")

  const handleFileInputChange = (event) => {
    console.log('on change triggered')
    setFileName(event.target.files[0].name)

    console.log(inputFileName)
    console.log(inputFileName.current)
    console.log(inputFileName.current.files)
  }

  if (loading) return (
    <OrganizationClasstypesBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </OrganizationClasstypesBase>
  )
  // Error
  if (error) return (
    <OrganizationClasstypesBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('general.error_sad_smiley')}</p>
      </ContentCard>
    </OrganizationClasstypesBase>
  )

  const initialData = data.organizationClasstype
  console.log('query data')
  console.log(data)

  return (
    <OrganizationClasstypesBase>
      <Card title={cardTitle}>
       <Formik
          initialValues={{}}
          // validationSchema={DOCUMENT_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
            let reader = new FileReader()
            reader.onload = function(reader_event) {
              console.log(reader_event.target.result)
              let b64_enc_image = reader_event.target.result

              uploadImage({ variables: {
                input: {
                  id: classtypeId,
                  image: b64_enc_image
                }
              }, refetchQueries: [
                  {query: GET_CLASSTYPES_QUERY, variables: {"archived": true }},
                  {query: GET_CLASSTYPES_QUERY, variables: {"archived": false }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data)
                  history.push(returnUrl)
                  toast.success((t('organization.classtypes.toast_image_save_success')), {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                }).catch((error) => {
                  toast.error((t('general.toast_server_error')) + ': ' +  error, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  console.log('there was an error sending the query', error);
                })
            }
            let file = inputFileName.current.files[0]
            reader.readAsDataURL(file)
          }}
          >
          {({ isSubmitting, errors, values }) => (
            <FoForm>
            <Card.Body>
              <Grid.Row>
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
                <Button color="link">
                  {t('general.cancel')}
                </Button>
              </Link>
            </Card.Footer>
          </FoForm>
          )}
        </Formik>
      </Card>
    </OrganizationClasstypesBase>
  )
}

export default withTranslation()(withRouter(OrganizationClasstypeEditImage))