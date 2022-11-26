import React from 'react'
import { useQuery, useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik } from 'formik'
import { toast } from 'react-toastify'

import { GET_ACCOUNT_QUERY } from '../queries'
import { UPDATE_ACCOUNT_PASSWORD } from './queries'
// import { ACCOUNT_SCHEMA } from './yupSchema'

import {
  Card,
  Dimmer,
} from "tabler-react"

import RelationsAccountPasswordForm from "./RelationsAccountPasswordForm"
import RelationsAccountProfileBase from '../RelationsAccountProfileBase'


function RelationsAccountTools({t, match}) {
  const accountId = match.params.account_id
  const cardTitle = t("relations.account.tools.title")
  const activeLink = "tools"

  const {loading, error, data} = useQuery(GET_ACCOUNT_QUERY, {
    variables: {id: accountId},
    fetchPolicy: "network-only"
  })
  const [updateAccountPassword] = useMutation(UPDATE_ACCOUNT_PASSWORD)

  if (loading) return (
    <RelationsAccountProfileBase activeLink={activeLink}>
      <Card>
        <Card.Header>
          <Card.Title>{cardTitle}</Card.Title>
        </Card.Header>
        <Card.Body>
          <Dimmer loader={true} active={true} />
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
          <Card.Title>{t("relations.accounts.set_password")}</Card.Title>
        </Card.Header>
        <Formik
            initialValues={{}}
            // validationSchema={ACCOUNT_SCHEMA}
            onSubmit={(values, { setSubmitting }) => {
                console.log('submit values:')
                console.log(values)

                let input_vars = {
                  id: accountId,
                  passwordNew: values.passwordNew
                }

                updateAccountPassword({ variables: {
                  input: input_vars
                }})
                .then(({ data }) => {
                  console.log('got data', data)
                  toast.success((t('relations.accounts.toast_edit_password_success')), {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  setSubmitting(false)
                }).catch((error) => {
                  toast.error((t('general.toast_server_error')) +  error, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  console.log('there was an error sending the query', error)
                  setSubmitting(false)
                }
              )
            }}
            >
            {({ isSubmitting, errors, values, setFieldTouched, setFieldValue }) => (
              <RelationsAccountPasswordForm
                isSubmitting={isSubmitting}
                setFieldTouched={setFieldTouched}
                setFieldValue={setFieldValue}
                errors={errors}
                values={values}
                inputData={data}
              />
            )}
          </Formik>
      </Card>
    </RelationsAccountProfileBase>
  )
}

export default withTranslation()(withRouter(RelationsAccountTools))