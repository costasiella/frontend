// @flow

import React, { useState, useRef } from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'

import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_DOCUMENTS_QUERY, ADD_DOCUMENT } from './queries'
import { GET_ACCOUNT_QUERY } from '../queries'
// import { CLASSPASS_SCHEMA } from './yupSchema'
import AccountClasspassForm from './AccountDocumentForm'
import RelationsAccountProfileBase from '../RelationsAccountProfileBase';

import {
  Icon,
  Button,
  Card,
} from "tabler-react";


function AccountDocumentAdd({t, match, history}) {
  const accountId = match.params.account_id
  const activeLink = "classpasses"
  const cardTitle = t('relations.account.documents.title_add')
  const returnUrl = `/relations/accounts/${accountId}/documents`
  
  const { loading, error, data } = useQuery(GET_ACCOUNT_QUERY, {
    variables: { id: accountId }
  })
  const [addAccountDocument] = useMutation(ADD_DOCUMENT)

  // Vars for document file input field start
  const [fileName, setFileName] = useState("")
  const inputFileName = useRef(null)
  const fileInputLabel = fileName || t("general.custom_file_input_inner_label")

  const handleFileInputChange = (event) => {
    console.log('on change triggered')
    setFileName(event.target.files[0].name)
  }

  const sidebarButton = <Link to={returnUrl}>
    <Button color="primary btn-block mb-6">
      <Icon prefix="fe" name="chevrons-left" /> {t('general.back')}
    </Button>
  </Link>

  if (loading) return(
    <RelationsAccountProfileBase activeLink={activeLink} sidebarButton={sidebarButton}>
      <Card title={cardTitle}>
        {t('general.loading_with_dots')}
      </Card>
    </RelationsAccountProfileBase>
  )

  if (error) return (
    <RelationsAccountProfileBase activeLink={activeLink} sidebarButton={sidebarButton}>
      {console.log(error)}
      <Card title={cardTitle}>
        {t('general.error_sad_smiley')}
      </Card>
    </RelationsAccountProfileBase>
  )
  
  const inputData = data
  const account = data.account

  return (
    <RelationsAccountProfileBase
      activeLink={activeLink}
      user={account}
      sidebarButton={sidebarButton} 
    >
      <Card>
        <Card.Header>
          <Card.Title>{cardTitle}</Card.Title>
        </Card.Header>
        <Formik
          initialValues={{ 
            description: ""
          }}
          // validationSchema={CLASSPASS_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
            console.log("Submit values")
            console.log(values)
            console.log(fileName)
  
            let inputVars = {
              account: accountId,
              description: values.description,
              documentFileName: fileName,
            }
  
            let reader = new FileReader()
            reader.onload = function(reader_event) {
              console.log(reader_event.target.result)
              let b64_enc_file = reader_event.target.result
              console.log(b64_enc_file)
              // Add uploaded document b64 encoded blob to input vars
              inputVars.document = b64_enc_file
  
              addAccountDocument({ variables: {
                input: inputVars
              }, refetchQueries: [
                  {query: GET_DOCUMENTS_QUERY, variables: {account: accountId}}
              ]})
              .then(({ data }) => {
                  console.log('got data', data);
                  history.push(returnUrl)
                  toast.success((t('relations.account.documents.toast_add_success')), {
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
            <AccountClasspassForm
              inputData={inputData}
              isSubmitting={isSubmitting}
              errors={errors}
              values={values}
              inputFileName={inputFileName}
              fileInputLabel={fileInputLabel}
              handleFileInputChange={handleFileInputChange}
              returnUrl={returnUrl}
            >
              {console.log(errors)}
            </AccountClasspassForm>
          )}
        </Formik>
      </Card>
    </RelationsAccountProfileBase>
  ) 
}

export default withTranslation()(withRouter(AccountDocumentAdd))
