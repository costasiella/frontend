import React, { useState, useRef } from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { 
  Formik,
  Form as FoForm, 
} from 'formik'


import { GET_CLASSTYPES_QUERY, GET_CLASSTYPE_QUERY, UPDATE_CLASSTYPE_IMAGE } from './queries'

import {
  Dimmer,
  Grid,
  Button,
  Card,
  Form,
} from "tabler-react";

import ContentCard from "../../general/ContentCard"
import OrganizationClasstypesBase from './OrganizationClasstypesBase';
import { customFileInputLabelStyle } from "../../../tools/custom_file_input_label_style"


function OrganizationClasstypeEditImage({t, history, match}) {
  const classtypeId = match.params.id
  const returnUrl = "/organization/classtypes"
  let cardTitle = t('organization.classtypes.edit_image')
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

  cardTitle = `${cardTitle} - ${data.organizationClasstype.name}`

  return (
    <OrganizationClasstypesBase showBack={true}>
      <Card title={cardTitle}>
       <Formik
          initialValues={{}}
          // validationSchema={DOCUMENT_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
            console.log("Submit values")
            console.log(values)
            console.log(fileName)
  
            let inputVars = {
              id: classtypeId,
              imageFileName: fileName,
            }
  
            let reader = new FileReader()
            reader.onload = function(reader_event) {
              console.log(reader_event.target.result)
              let b64_enc_file = reader_event.target.result
              console.log(b64_enc_file)
              // Add uploaded document b64 encoded blob to input vars
              inputVars.image = b64_enc_file
  
              uploadImage({ variables: {
                input: inputVars
              }, refetchQueries: [
                {query: GET_CLASSTYPES_QUERY, variables: {"archived": false }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data);
                  history.push(returnUrl)
                  toast.success((t('organization.classtypes.toast_edit_success')), {
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
            if (file && file.size < 5242880) {
              reader.readAsDataURL(file)
            } else if (file && file.size > 5242880) { 
              toast.error(t("error_messages.selected_file_exceeds_max_filesize"), {
                position: toast.POSITION.BOTTOM_RIGHT
              })
              setSubmitting(false)
            } else {
              toast.error(t("general.please_select_a_file"), {
                position: toast.POSITION.BOTTOM_RIGHT
              })
              setSubmitting(false)
            }
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