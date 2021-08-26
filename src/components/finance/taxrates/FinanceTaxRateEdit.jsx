// @flow

import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik, Form as FoForm, Field, ErrorMessage } from 'formik'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

import { GET_TAXRATES_QUERY, GET_TAXRATE_QUERY, UPDATE_TAXRATE } from './queries'
import { TAX_RATE_SCHEMA } from './yupSchema'

import {
  Button,
  Card,
  Dimmer,
  Form
} from "tabler-react";

import ContentCard from "../../general/ContentCard"
import FinanceTaxRatesBase from './FinanceTaxRatesBase';


function FinanceTaxRateEdit({t, match, history}) {
  const id = match.params.id
  const returnUrl = "/finance/taxrates"
  const cardTitle = t('finance.taxrates.title_edit')
  const { loading, error, data } = useQuery(GET_TAXRATE_QUERY, {
    variables: { id: id }
  })
  const [ updateTaxrate ] = useMutation(UPDATE_TAXRATE)

  if (loading) return (
    <FinanceTaxRatesBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </FinanceTaxRatesBase>
  )

  if (error) return (
    <FinanceTaxRatesBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('finance.taxrates.error_loading')}</p>
      </ContentCard>
    </FinanceTaxRatesBase>
  )

  const initialData = data.financeTaxRate;
  console.log('query data')
  console.log(data)

  return (
    <FinanceTaxRatesBase showBack={true}>
      <Card title={cardTitle}>
        <Formik
            initialValues={{ 
              name: initialData.name, 
              percentage: initialData.percentage,
              rateType: initialData.rateType,
              code: initialData.code,
            }}
            validationSchema={TAX_RATE_SCHEMA}
            onSubmit={(values, { setSubmitting }) => {
                console.log('submit values:')
                console.log(values)

                updateTaxrate({ variables: {
                  input: {
                    id: match.params.id,
                    name: values.name,
                    percentage: values.percentage,
                    rateType: values.rateType,
                    code: values.code,
                  }
                }, refetchQueries: [
                    {query: GET_TAXRATES_QUERY, variables: {"archived": false }}
                ]})
                .then(({ data }) => {
                    console.log('got data', data)
                    history.push(returnUrl)
                    toast.success((t('finance.taxrates.toast_edit_success')), {
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
    </FinanceTaxRatesBase>
  )
}


export default withTranslation()(withRouter(FinanceTaxRateEdit))