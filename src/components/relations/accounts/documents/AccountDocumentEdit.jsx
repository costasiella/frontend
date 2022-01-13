import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_DOCUMENTS_QUERY, GET_DOCUMENT_QUERY, UPDATE_DOCUMENT } from './queries'
import { DOCUMENT_SCHEMA } from './yupSchema'
import AccountDocumentFormEdit from './AccountDocumentFormEdit'
import RelationsAccountProfileBase from '../RelationsAccountProfileBase';

import {
  Card,
} from "tabler-react";


function AccountDocumentEdit({t, history, match}) {
  const id = match.params.id
  const accountId = match.params.account_id
  const activeLink = "documents"
  const cardTitle = t('relations.account.documents.title_edit')
  const returnUrl = `/relations/accounts/${accountId}/documents`
  
  const {loading, error, data} = useQuery(GET_DOCUMENT_QUERY, {
    variables: { id: id, account: accountId }
  })
  const [updateDocument] = useMutation(UPDATE_DOCUMENT)


  if (loading) return(
    <RelationsAccountProfileBase activeLink={activeLink} returnUrl={returnUrl}>
      <Card title={cardTitle}>
        {t('general.loading_with_dots')}
      </Card>
    </RelationsAccountProfileBase>
  )

  if (error) return (
    <RelationsAccountProfileBase activeLink={activeLink} returnUrl={returnUrl}>
      {console.log(error)}
      <Card title={cardTitle}>
        {t('general.error_sad_smiley')}
      </Card>
    </RelationsAccountProfileBase>
  )

  const inputData = data
  const account = data.account
  const initialdata = data.accountDocument

  return (
    <RelationsAccountProfileBase
      activeLink={activeLink}
      user={account}
      returnUrl={returnUrl} 
    >
      <Card>
        <Card.Header>
          <Card.Title>{cardTitle}</Card.Title>
        </Card.Header>
        <Formik
          initialValues={{ 
            description: initialdata.description,
          }}
          validationSchema={DOCUMENT_SCHEMA}
          onSubmit={(values, { setSubmitting }, errors) => {
              console.log('submit values:')
              console.log(values)
              console.log(errors)

              updateDocument({ variables: {
                input: {
                  id: id,
                  description: values.description
                }
              }, refetchQueries: [
                {query: GET_DOCUMENTS_QUERY, variables: { account: accountId }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data)
                  history.push(returnUrl)
                  toast.success((t('relations.account.documents.toast_edit_success')), {
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
          {({ isSubmitting, setFieldValue, setFieldTouched, errors, values }) => (
            <AccountDocumentFormEdit
              inputData={inputData}
              isSubmitting={isSubmitting}
              errors={errors}
              values={values}
              returnUrl={returnUrl}
            >
              {console.log(errors)}
            </AccountDocumentFormEdit>
          )}
        </Formik>
      </Card>
    </RelationsAccountProfileBase>
  )
}

export default withTranslation()(withRouter(AccountDocumentEdit))
