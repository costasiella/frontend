// @flow

import React, {Component } from 'react'
import { gql, useMutation, useQuery } from "@apollo/client"
import { Query, Mutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik, Form as FoForm, Field, ErrorMessage } from 'formik'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

import { GET_GLACCOUNTS_QUERY, GET_GLACCOUNT_QUERY, UPDATE_GLACCOUNT } from './queries'
import { GLACCOUNT_SCHEMA } from './yupSchema'


import {
  Button,
  Card,
  Dimmer,
  Form
} from "tabler-react";

import ContentCard from "../../general/ContentCard"
import FinanceGLAccountsBase from './FinanceGLAccountsBase'


function FinanceGLAccountEdit({t, history, match}) {
  const id = match.params.id
  const returnUrl = "/finance/glaccounts"
  const cardTitle = t('finance.glaccounts.title_edit')
  const { loading, error, data } = useQuery(GET_GLACCOUNT_QUERY, {
    variables: { id: id }
  })
  const [ updateGlaccount ] = useMutation(UPDATE_GLACCOUNT)

  if (loading) return (
    <FinanceGLAccountsBase>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </FinanceGLAccountsBase>
  )

  if (error) return (
    <FinanceGLAccountsBase>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('general.error_sad_smiley')}</p>
      </ContentCard>
    </FinanceGLAccountsBase>
  )

  const initialData = data.financeGlaccount;
  console.log('query data')
  console.log(data)

  return (
    <FinanceGLAccountsBase>
      <Card title={cardTitle}>
        <Formik
          initialValues={{ 
            name: initialData.name, 
            code: initialData.code
          }}
          validationSchema={GLACCOUNT_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              console.log('submit values:')
              console.log(values)

              updateGlaccount({ variables: {
                input: {
                  id: match.params.id,
                  name: values.name,
                  code: values.code
                }
              }, refetchQueries: [
                  {query: GET_GLACCOUNTS_QUERY, variables: {"archived": false }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data)
                  history.push(returnUrl)
                  toast.success((t('finance.glaccounts.toast_edit_success')), {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                }).catch((error) => {
                  toast.error((t('general.toast_server_error')) +  error, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  console.log('there was an error sending the query', error)
                  setSubmitting(false)
                })
          }}
          >
          {({ isSubmitting, errors, values }) => (
            <FoForm>
                <Card.Body>
                  <Form.Group label={t('general.name')}>
                    <Field type="text" 
                            name="name" 
                            className={(errors.name) ? "form-control is-invalid" : "form-control"} 
                            autoComplete="off" />
                    <ErrorMessage name="name" component="span" className="invalid-feedback" />
                  </Form.Group>
                  <Form.Group label={t('finance.code')}>
                    <Field type="text" 
                            name="code" 
                            className={(errors.code) ? "form-control is-invalid" : "form-control"} 
                            autoComplete="off" />
                    <ErrorMessage name="code" component="span" className="invalid-feedback" />
                  </Form.Group>
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
                    <Link to={returnUrl}>
                      <Button
                        type="button" 
                        color="link" 
                      >
                          {t('general.cancel')}
                      </Button>
                    </Link>
                </Card.Footer>
            </FoForm>
          )}
        </Formik>
      </Card>
    </FinanceGLAccountsBase>
  )
}


export default withTranslation()(withRouter(FinanceGLAccountEdit))