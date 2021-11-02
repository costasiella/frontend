// @flow

import React, { useState, useRef } from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_ACCOUNTS_QUERY, GET_ACCOUNT_QUERY, UPDATE_ACCOUNT } from './queries'
import { ACCOUNT_SCHEMA } from './yupSchema'

import {
  Page,
  Grid,
  Icon,
  Button,
  Card,
  Container
} from "tabler-react"
import SiteWrapper from "../../SiteWrapper"
import HasPermissionWrapper from "../../HasPermissionWrapper"
import { dateToLocalISO } from '../../../tools/date_tools'
import ProfileCardSmall from "../../ui/ProfileCardSmall"

import { get_list_query_variables } from "./tools"
import RelationsAccountsBack from "./RelationsAccountsBack"
import RelationsAccountProfileImageForm from "./RelationsAccountProfileImageForm"

// import OrganizationMenu from "../OrganizationMenu"
import ProfileMenu from "./ProfileMenu"
import RelationsAccountProfileBase from './RelationsAccountProfileBase'

function RelationsAccountProfileImage({t, match, history}) {
  const accountId = match.params.account_id
  const activeLink = "profile"
  const cardTitle = t('relations.accounts.profile_image')
  const returnUrl = `/relations/accounts/${accountId}/profile` 

  const {loading, error, data} = useQuery(GET_ACCOUNT_QUERY, {
    variables: {id: accountId}
  })
  const [updateAccount] = useMutation(UPDATE_ACCOUNT)

  // Vars file input field start
  const [fileName, setFileName] = useState("")
  const inputFileName = useRef(null)
  const fileInputLabel = fileName || t("general.custom_file_input_inner_label")

  const handleFileInputChange = (event) => {
    console.log('on change triggered')
    setFileName(event.target.files[0].name)
  }
  // Vars file input field end

  if (loading) return (
    <RelationsAccountProfileBase activeLink={activeLink}>
      <Card>
        <Card.Header>
          <Card.Title>{cardTitle}</Card.Title>
        </Card.Header>
        <Card.Body>
          <p>{t('general.loading_with_dots')}</p>  
        </Card.Body>
      </Card>
    </RelationsAccountProfileBase>
  )

  if (error) return (
    <RelationsAccountProfileBase activeLink={activeLink}>
      {console.log(error)}
      <Card>
        <Card.Header>
          <Card.Title>{cardTitle}</Card.Title>
        </Card.Header>
        <Card.Body>
          <p>{t('general.error_sad_smiley')}</p>
        </Card.Body>
      </Card>
    </RelationsAccountProfileBase>
  )

  const account = data.account
  console.log(account)

  return (
    <RelationsAccountProfileBase 
      user={account}
      activeLink={activeLink}
    >
      <Card>
        <Card.Header>
          <Card.Title>{cardTitle}</Card.Title>
        </Card.Header>
        <Card.Body>
        <Formik
            initialValues={{}}
            // validationSchema={ACCOUNT_SCHEMA}
            onSubmit={(values, { setSubmitting }) => {
                console.log('submit values:')
                console.log(values)

                let inputVars = {
                  id: accountId,
                }

                function updateImage() {
                  updateAccount({ variables: {
                    input: inputVars
                  }, refetchQueries: [
                      // Refetch list
                      {query: GET_ACCOUNTS_QUERY, variables: get_list_query_variables()},
                      // Refresh local cached results for this account
                      {query: GET_ACCOUNT_QUERY, variables: {id: accountId}}
                  ]})
                  .then(({ data }) => {
                      console.log('got data', data)
                      history.push(`/relations/accounts/${accountId}/profile`)
                      toast.success((t('relations.accounts.toast_edit_success')), {
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

                let reader = new FileReader()
                reader.onload = function(reader_event) {
                  console.log(reader_event.target.result)
                  let b64_enc_file = reader_event.target.result
                  console.log(b64_enc_file)
                  // Add uploaded document b64 encoded blob to input vars
                  inputVars.image = b64_enc_file
                  inputVars.imageFileName = fileName
      
                  updateImage()
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
                  updateImage()
                }
            }}
            >
            {({ isSubmitting, values }) => (
              <RelationsAccountProfileImageForm
                isSubmitting={isSubmitting}
                values={values}
                inputData={data}
                inputFileName={inputFileName}
                fileInputLabel={fileInputLabel}
                handleFileInputChange={handleFileInputChange}
                returnUrl={returnUrl}
              />
            )}
          </Formik>
        </Card.Body>
      </Card>
    </RelationsAccountProfileBase>
  )
}

export default withTranslation()(withRouter(RelationsAccountProfileImage))