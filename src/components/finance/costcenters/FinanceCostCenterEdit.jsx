// @flow

import React from 'react'
import { useQuery, useMutation } from "@apollo/client"
import { withTranslation } from 'react-i18next'
import { withRouter } from "react-router"
import { Formik, Form as FoForm, Field, ErrorMessage } from 'formik'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

import { GET_COSTCENTERS_QUERY, GET_COSTCENTER_QUERY, UPDATE_COSTCENTER } from './queries'
import { COSTCENTER_SCHEMA } from './yupSchema'

import {
  Button,
  Card,
  Dimmer,
  Form
} from "tabler-react";

import ContentCard from "../../general/ContentCard"
import FinanceCostCentersBase from './FinanceCostCentersBase';


function FinanceCostCenterEdit({t, match, history}) {
  const id = match.params.id
  const cardTitle = t('finance.costcenters.title_edit')
  const returnUrl = "/finance/costcenters"
  const { loading, error, data } = useQuery(GET_COSTCENTER_QUERY, {
    variables: { id: id }
  })
  const [ updateCostcenter ] = useMutation(UPDATE_COSTCENTER)

  if (loading) return (
    <FinanceCostCentersBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <Dimmer active={true}
                loader={true}>
        </Dimmer>
      </ContentCard>
    </FinanceCostCentersBase>
  )

  if (error) return (
    <FinanceCostCentersBase showBack={true}>
      <ContentCard cardTitle={cardTitle}>
        <p>{t('general.error_sad_smiley')}</p>
      </ContentCard>
    </FinanceCostCentersBase>
  )

  const initialData = data.financeCostcenter;

  return (
    <FinanceCostCentersBase showBack={true}>
      <Card title={cardTitle}>
        <Formik
            initialValues={{ 
              name: initialData.name, 
              code: initialData.code
            }}
            validationSchema={COSTCENTER_SCHEMA}
            onSubmit={(values, { setSubmitting }) => {
                console.log('submit values:')
                console.log(values)

                updateCostcenter({ variables: {
                  input: {
                    id: match.params.id,
                    name: values.name,
                    code: parseInt(values.code)
                  }
                }, refetchQueries: [
                    {query: GET_COSTCENTERS_QUERY, variables: {"archived": false }}
                ]})
                .then(({ data }) => {
                    console.log('got data', data)
                    history.push(returnUrl)
                    toast.success((t('finance.costcenters.toast_edit_success')), {
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
    </FinanceCostCentersBase>
  )
}


export default withTranslation()(withRouter(FinanceCostCenterEdit))