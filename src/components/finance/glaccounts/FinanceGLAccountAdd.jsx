import React from 'react'
import { useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik, Form as FoForm, Field, ErrorMessage } from 'formik'
import { toast } from 'react-toastify'
import { Link } from "react-router-dom"

import { GET_GLACCOUNTS_QUERY, ADD_GLACCOUNT } from './queries'
import { GLACCOUNT_SCHEMA } from './yupSchema'


import {
  Button,
  Card,
  Form,
} from "tabler-react"

import FinanceGLAccountsBase from './FinanceGLAccountsBase'


function FinanceGLAccountAdd({t, history}) {
  const returnUrl = "/finance/glaccounts"
  const [ addGlaccount ] = useMutation(ADD_GLACCOUNT)

  return (
    <FinanceGLAccountsBase>
      <Card title={t('finance.glaccounts.title_add')}>
        <Formik
          initialValues={{ name: '', code: '' }}
          validationSchema={GLACCOUNT_SCHEMA}
          onSubmit={(values, { setSubmitting }) => {
              addGlaccount({ variables: {
                input: {
                  name: values.name, 
                  code: values.code
                }
              }, refetchQueries: [
                  {query: GET_GLACCOUNTS_QUERY, variables: {"archived": false }}
              ]})
              .then(({ data }) => {
                  console.log('got data', data);
                  history.push(returnUrl)
                  toast.success((t('finance.glaccounts.toast_add_success')), {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                }).catch((error) => {
                  toast.error((t('general.toast_server_error')) + ': ' +  error, {
                      position: toast.POSITION.BOTTOM_RIGHT
                    })
                  console.log('there was an error sending the query', error)
                  setSubmitting(false)
                })
          }}
          >
          {({ isSubmitting, errors }) => (
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
    </FinanceGLAccountsBase>
  )
}


export default withTranslation()(withRouter(FinanceGLAccountAdd))