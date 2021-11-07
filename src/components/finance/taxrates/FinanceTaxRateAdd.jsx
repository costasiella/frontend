import React from 'react'
import { useMutation } from "@apollo/client";
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik, Form as FoForm, Field, ErrorMessage } from 'formik'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

import { GET_TAXRATES_QUERY, ADD_TAXRATE } from './queries'
import { TAX_RATE_SCHEMA } from './yupSchema'

import {
  Button,
  Card,
  Form,
} from "tabler-react"

import FinanceTaxRatesBase from './FinanceTaxRatesBase';


function FinanceTaxRateAdd({t, history}) {
  const returnUrl = "/finance/taxrates"
  const [ addFinanceTaxrate ] = useMutation(ADD_TAXRATE)

  return (
    <FinanceTaxRatesBase showBack={true}>
      <Card title={t('finance.taxrates.title_add')}>
        <Formik
            initialValues={{ name: "", percentage: "", rateType: "IN", code: "" }}
            validationSchema={TAX_RATE_SCHEMA}
            onSubmit={(values, { setSubmitting }) => {
                addFinanceTaxrate({ variables: {
                  input: {
                    name: values.name,
                    percentage: values.percentage,
                    rateType: values.rateType, 
                    code: values.code,
                  }
                }, refetchQueries: [
                    {query: GET_TAXRATES_QUERY, variables: {"archived": false }}
                ]})
                .then(({ data }) => {
                    console.log('got data', data);
                    history.push(returnUrl)
                    toast.success((t('finance.taxrates.toast_add_success')), {
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
                      <Form.Group label={t('finance.taxrates.percentage')}>
                        <Field type="text" 
                                name="percentage" 
                                className={(errors.percentage) ? "form-control is-invalid" : "form-control"} 
                                autoComplete="off" />
                        <ErrorMessage name="percentage" component="span" className="invalid-feedback" />
                      </Form.Group>
                      <Form.Group label={t('finance.taxrates.rateType')}>
                        <Field component="select" 
                                name="rateType" 
                                className={(errors.rateType) ? "form-control is-invalid" : "form-control"} 
                                autoComplete="off">
                          <option value="IN">{t('finance.taxrates.including')}</option>
                          <option value="EX">{t('finance.taxrates.excluding')}</option>
                        </Field>
                        <ErrorMessage name="rateType" component="span" className="invalid-feedback" />
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
    </FinanceTaxRatesBase>
  )
}


export default withTranslation()(withRouter(FinanceTaxRateAdd))